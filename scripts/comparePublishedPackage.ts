import { existsSync, readdirSync, statSync } from 'fs';
import { join, relative, resolve } from 'path';

const getPublishedPackageDir = () => {
  const value = process.env.PUBLISHED_PACKAGE_DIR;
  if (!value) {
    throw new Error(
      'Set PUBLISHED_PACKAGE_DIR to an unpacked package directory',
    );
  }
  return value;
};

interface LegacyJson {
  comment: string;
  items: LegacyItem[];
}

interface LegacyItem {
  readable: string;
  id: string;
  texture: string;
}

interface LegacyJsonById {
  comment: string;
  items: Record<string, { readable: string; texture: string }>;
}

const localPackageDir = resolve('.');
const publishedPackageDir = getPublishedPackageDir();
const publishedDistDir = join(publishedPackageDir, 'dist');
const localDistDir = join(localPackageDir, 'dist');
const failures: string[] = [];
let intentionalByIdCorrections = 0;

await comparePublishedDistFilePresence();
await compareRootExports();
await compareLegacyImportPaths();
await compareLegacyJsonFiles();
await compareLegacyJsFiles();

if (failures.length > 0) {
  console.error(`Found ${failures.length} compatibility failures.`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Published package compatibility check passed.');
if (intentionalByIdCorrections > 0) {
  console.log(
    `Corrected ${intentionalByIdCorrections} legacy .id.json file(s) that differed from the published by-id generator bug.`,
  );
}

async function comparePublishedDistFilePresence() {
  for (const file of listFiles(publishedDistDir)) {
    const localPath = join(localDistDir, file);
    if (!existsSync(localPath)) {
      failures.push(`Missing published dist file: dist/${file}`);
    }
  }
}

async function compareRootExports() {
  const published = require(
    join(publishedPackageDir, 'dist/minecraft-textures.js'),
  );
  const local = require(join(localPackageDir, 'dist/minecraft-textures.js'));

  compareJsonValue('root textures export', local.textures, published.textures);
  compareJsonValue('root versions export', local.versions, published.versions);
  compareJsonValue(
    'root latestVersion export',
    local.latestVersion,
    published.latestVersion,
  );

  for (const version of published.textures as string[]) {
    if (local.default(version) !== published.default(version)) {
      failures.push(`Root default export changed for version ${version}`);
    }
  }

  if (local.default('definitely-not-a-version') !== false) {
    failures.push(
      'Root default export should return false for unknown versions',
    );
  }
}

async function compareLegacyImportPaths() {
  const published = require(
    join(publishedPackageDir, 'dist/minecraft-textures.js'),
  );
  const versions = published.textures as string[];

  const specifiers = [
    'minecraft-textures',
    ...versions.flatMap((version) => [
      `minecraft-textures/dist/textures/json/${version}.json`,
      `minecraft-textures/dist/textures/json/${version}.id.json`,
      `minecraft-textures/dist/textures/${version}.js`,
    ]),
  ];

  for (const specifier of specifiers) {
    try {
      require(specifier);
    } catch (error) {
      failures.push(
        `Legacy import path failed: ${specifier} (${(error as Error).message})`,
      );
    }
  }
}

async function compareLegacyJsonFiles() {
  const publishedJsonDir = join(publishedDistDir, 'textures/json');
  const localJsonDir = join(localDistDir, 'textures/json');
  const files = readdirSync(publishedJsonDir)
    .filter((file) => file.endsWith('.json'))
    .sort();

  for (const file of files) {
    const publishedPath = join(publishedJsonDir, file);
    const localPath = join(localJsonDir, file);
    if (!existsSync(localPath)) {
      failures.push(`Missing legacy JSON file: dist/textures/json/${file}`);
      continue;
    }

    const localJson = await Bun.file(localPath).json();

    if (file.endsWith('.id.json')) {
      const version = file.slice(0, -'.id.json'.length);
      const publishedLegacyJson = (await Bun.file(
        join(publishedJsonDir, `${version}.json`),
      ).json()) as LegacyJson;
      const publishedBuggyIdJson = (await Bun.file(
        publishedPath,
      ).json()) as LegacyJsonById;
      const expectedById = createLegacyJsonById(publishedLegacyJson);

      compareLegacyByIdContent(file, localJson as LegacyJsonById, expectedById);
      if (legacyByIdContentChanged(publishedBuggyIdJson, expectedById)) {
        intentionalByIdCorrections++;
      }
    } else {
      const publishedJson = await Bun.file(publishedPath).json();
      compareJsonValue(`legacy JSON ${file}`, localJson, publishedJson);
      compareLegacyTextureBytes(
        file,
        localJson as LegacyJson,
        publishedJson as LegacyJson,
      );
    }
  }
}

async function compareLegacyJsFiles() {
  const publishedTexturesDir = join(publishedDistDir, 'textures');
  const files = readdirSync(publishedTexturesDir)
    .filter((file) => file.endsWith('.js'))
    .sort();

  for (const file of files) {
    const publishedModule = require(join(publishedTexturesDir, file));
    const localModule = require(join(localDistDir, 'textures', file));
    const version = file.slice(0, -'.js'.length);
    const localJson = await Bun.file(
      join(localDistDir, 'textures/json', `${version}.json`),
    ).json();

    compareJsonValue(
      `legacy JS follows JSON order ${file}`,
      localModule.default,
      localJson,
    );
    compareLegacyJsContent(file, localModule.default, publishedModule.default);
  }
}

function compareLegacyJsContent(
  file: string,
  localJson: LegacyJson,
  publishedJson: LegacyJson,
) {
  if (localJson.comment !== publishedJson.comment) {
    failures.push(`legacy JS comment changed for ${file}`);
  }
  compareLegacyItemMultiset(
    `legacy JS default export ${file}`,
    localJson,
    publishedJson,
  );
}

function compareLegacyTextureBytes(
  file: string,
  localJson: LegacyJson,
  publishedJson: LegacyJson,
) {
  if (localJson.items.length !== publishedJson.items.length) {
    failures.push(
      `${file} item count changed: ${publishedJson.items.length} -> ${localJson.items.length}`,
    );
    return;
  }

  for (let i = 0; i < publishedJson.items.length; i++) {
    const published = publishedJson.items[i];
    const local = localJson.items[i];
    if (published.id !== local.id) {
      failures.push(`${file}[${i}] id changed: ${published.id} -> ${local.id}`);
      continue;
    }
    if (!sameDataUrlBytes(local.texture, published.texture)) {
      failures.push(`${file}[${i}] texture bytes changed for ${published.id}`);
    }
  }
}

function compareLegacyItemMultiset(
  name: string,
  localJson: LegacyJson,
  publishedJson: LegacyJson,
) {
  const localItems = countItems(localJson.items);
  const publishedItems = countItems(publishedJson.items);
  compareJsonValue(name, localItems, publishedItems);
}

function countItems(items: LegacyItem[]) {
  const counts: Record<string, number> = {};
  for (const item of items) {
    const key = JSON.stringify(item);
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return Object.entries(counts).sort(([a], [b]) => a.localeCompare(b));
}

function compareLegacyByIdContent(
  file: string,
  localJson: LegacyJsonById,
  publishedJson: LegacyJsonById,
) {
  if (localJson.comment !== publishedJson.comment) {
    failures.push(`legacy .id.json comment changed for ${file}`);
  }

  const publishedIds = Object.keys(publishedJson.items);
  const localIds = Object.keys(localJson.items);
  const missing = publishedIds.filter((id) => !(id in localJson.items));
  const extra = localIds.filter((id) => !(id in publishedJson.items));

  for (const id of missing) failures.push(`${file} missing id ${id}`);
  for (const id of extra) failures.push(`${file} has extra id ${id}`);

  for (const id of publishedIds) {
    const published = publishedJson.items[id];
    const local = localJson.items[id];
    if (!local) continue;
    if (local.readable !== published.readable) {
      failures.push(
        `${file} readable changed for ${id}: ${published.readable} -> ${local.readable}`,
      );
    }
    if (!sameDataUrlBytes(local.texture, published.texture)) {
      failures.push(`${file} texture bytes changed for ${id}`);
    }
  }
}

function legacyByIdContentChanged(
  localJson: LegacyJsonById,
  publishedJson: LegacyJsonById,
) {
  if (localJson.comment !== publishedJson.comment) return true;

  const publishedIds = Object.keys(publishedJson.items);
  const localIds = Object.keys(localJson.items);
  if (
    publishedIds.some((id) => !(id in localJson.items)) ||
    localIds.some((id) => !(id in publishedJson.items))
  ) {
    return true;
  }

  return publishedIds.some((id) => {
    const published = publishedJson.items[id];
    const local = localJson.items[id];
    return (
      local.readable !== published.readable ||
      !sameDataUrlBytes(local.texture, published.texture)
    );
  });
}

function createLegacyJsonById(legacy: LegacyJson): LegacyJsonById {
  return {
    comment: legacy.comment,
    items: legacy.items.reduce(
      (acc, item) => ({
        ...acc,
        [item.id]: {
          readable: item.readable,
          texture: item.texture,
        },
      }),
      {} as Record<string, { readable: string; texture: string }>,
    ),
  };
}

function sameDataUrlBytes(a: string, b: string) {
  const prefix = 'data:image/png;base64,';
  if (!a.startsWith(prefix) || !b.startsWith(prefix)) return false;
  return bytesEqual(
    Uint8Array.from(Buffer.from(a.slice(prefix.length), 'base64')),
    Uint8Array.from(Buffer.from(b.slice(prefix.length), 'base64')),
  );
}

function bytesEqual(a: Uint8Array, b: Uint8Array) {
  return a.length === b.length && a.every((byte, index) => byte === b[index]);
}

function compareJsonValue(name: string, local: unknown, published: unknown) {
  if (JSON.stringify(local) !== JSON.stringify(published)) {
    failures.push(`${name} changed`);
  }
}

function listFiles(dir: string) {
  const files: string[] = [];
  const visit = (current: string) => {
    for (const entry of readdirSync(current)) {
      const path = join(current, entry);
      if (statSync(path).isDirectory()) {
        visit(path);
      } else {
        files.push(relative(dir, path));
      }
    }
  };
  visit(dir);
  return files.sort();
}

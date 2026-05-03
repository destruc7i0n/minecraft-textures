import { join } from 'path';

import { headers } from '../../../lib/constants';
import { createLegacyIdJson, createLegacyJson } from '../data/legacy';
import type {
  ResolvedVersion,
  TextureManifest,
  TextureManifestItem,
} from '../data/types';
import { writeFile, writeJson } from './files';

export async function writeManifestIndex(
  versions: string[],
  latestVersion: string,
  packageVersion: string,
) {
  await writeJson('./dist/textures/manifest/index.json', {
    packageVersion,
    latestVersion,
    versions,
  });
}

export async function writeVersionOutputs(version: ResolvedVersion) {
  const manifestItems = toManifestItems(version);
  const legacy = await createLegacyJson(version);
  const legacyById = await createLegacyIdJson(version);

  await Promise.all([
    writeJson(
      `./dist/textures/manifest/${version.version}.json`,
      toManifest(version, manifestItems),
    ),
    writeJson(
      `./dist/textures/manifest/${version.version}.id.json`,
      toManifestById(version, manifestItems),
    ),
    writeJson(`./dist/textures/json/${version.version}.json`, legacy),
    writeJson(`./dist/textures/json/${version.version}.id.json`, legacyById),
    writeLegacyVersionJs(version.version, legacy),
  ]);
}

export async function writeResolvedAssets(versions: ResolvedVersion[]) {
  const assets = new Map<string, string>();

  for (const version of versions) {
    for (const item of version.items) {
      assets.set(item.texture, item.dataTexturePath);
    }
  }

  await Promise.all(
    Array.from(assets, ([texture, source]) =>
      Bun.write(join('./dist/textures/assets', texture), Bun.file(source)),
    ),
  );
}

function toManifestItems(version: ResolvedVersion): TextureManifestItem[] {
  return version.items.map((item) => ({
    id: item.id,
    readable: item.readable,
    texture: item.texture,
  }));
}

function toManifest(
  version: ResolvedVersion,
  items: TextureManifestItem[],
): TextureManifest {
  return {
    comment: headers.comment,
    version: version.version,
    items,
  };
}

function toManifestById(
  version: ResolvedVersion,
  items: TextureManifestItem[],
) {
  return {
    comment: headers.comment,
    version: version.version,
    items: items.reduce(
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

async function writeLegacyVersionJs(version: string, legacy: unknown) {
  await writeFile(
    `./dist/textures/${version}.js`,
    `Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ${JSON.stringify(legacy)};
`,
  );
}

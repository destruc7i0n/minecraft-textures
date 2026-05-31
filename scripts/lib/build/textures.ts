import { headers } from '../../../lib/constants';
import {
  createLegacyJson,
  createLegacyJsonById,
  type LegacyJson,
} from '../data/legacy';
import type {
  ResolvedVersion,
  TextureManifest,
  TextureManifestItem,
} from '../data/types';
import {
  requireBuiltTexture,
  type BuiltTextureCatalog,
} from './build-textures';
import { writeJson } from './files';

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

export async function writeVersionOutputs(
  version: ResolvedVersion,
  catalog: BuiltTextureCatalog,
) {
  const manifestItems = createManifestItems(version, catalog);
  const legacy = createLegacyJson(
    version,
    (item) => requireBuiltTexture(catalog, item).dataUrl,
  );
  const legacyById = createLegacyJsonById(legacy);

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

function createManifestItems(
  version: ResolvedVersion,
  catalog: BuiltTextureCatalog,
): TextureManifestItem[] {
  return version.items.map((item) => ({
    id: item.id,
    readable: item.readable,
    texture: requireBuiltTexture(catalog, item).assetPath,
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

async function writeLegacyVersionJs(version: string, legacy: LegacyJson) {
  const source = await Bun.file('./src/legacy-textures.ts').text();

  const result = await Bun.build({
    entrypoints: ['/virtual/legacy-textures.ts'],
    files: {
      '/virtual/legacy-textures.ts': source,
      '/virtual/legacy-textures.json': JSON.stringify(legacy),
    },
    outdir: './dist/textures',
    format: 'cjs',
    target: 'node',
    naming: `${version}.js`,
  });

  if (!result.success) {
    throw new Error(
      `Failed to build legacy JS ${version}:\n${result.logs.join('\n')}`,
    );
  }
}

import { createHash } from 'node:crypto';
import { mkdir, rm } from 'fs/promises';
import { join } from 'path';

import { headers } from '../../../lib/constants';
import {
  createLegacyIdJson,
  createLegacyJson,
  type LegacyJson,
} from '../data/legacy';
import { addPngTextMetadata, DIST_PNG_METADATA } from '../data/png';
import type {
  ResolvedVersion,
  TextureManifest,
  TextureManifestItem,
} from '../data/types';
import { writeJson } from './files';

export type PublishedAssets = Map<string, string>;

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
  assets: PublishedAssets,
) {
  const manifestItems = createManifestItems(version, assets);
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

export async function writeResolvedAssets(
  versions: ResolvedVersion[],
  options: { outputDir?: string } = {},
): Promise<PublishedAssets> {
  const outputDir = options.outputDir ?? './dist/textures/assets';
  const assetPathBySourcePath: PublishedAssets = new Map();
  const outputByAssetPath = new Map<string, Uint8Array>();

  for (const version of versions) {
    for (const item of version.items) {
      if (assetPathBySourcePath.has(item.dataTexturePath)) continue;

      const bytes = await Bun.file(item.dataTexturePath).bytes();
      const output = addPngTextMetadata(bytes, DIST_PNG_METADATA);
      const texture = `${hashPng(output)}.png`;
      const existing = outputByAssetPath.get(texture);

      assetPathBySourcePath.set(item.dataTexturePath, texture);
      if (existing && !bytesEqual(existing, output)) {
        throw new Error(`Hash collision for ${texture}`);
      }
      outputByAssetPath.set(texture, output);
    }
  }

  await rm(outputDir, { recursive: true, force: true });
  await mkdir(outputDir, { recursive: true });
  await Promise.all(
    Array.from(outputByAssetPath, async ([texture, output]) => {
      await Bun.write(join(outputDir, texture), output);
    }),
  );

  return assetPathBySourcePath;
}

function createManifestItems(
  version: ResolvedVersion,
  assets: PublishedAssets,
): TextureManifestItem[] {
  return version.items.map((item) => ({
    id: item.id,
    readable: item.readable,
    texture: resolvePublishedAsset(item, assets),
  }));
}

function resolvePublishedAsset(
  item: ResolvedVersion['items'][number],
  assets: PublishedAssets,
): string {
  const texture = assets.get(item.dataTexturePath);
  if (!texture) {
    throw new Error(`Missing published asset for ${item.id}`);
  }

  return texture;
}

function hashPng(bytes: Uint8Array): string {
  return createHash('sha256').update(bytes).digest('hex').slice(0, 16);
}

function bytesEqual(a: Uint8Array, b: Uint8Array): boolean {
  return a.length === b.length && a.every((byte, index) => byte === b[index]);
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

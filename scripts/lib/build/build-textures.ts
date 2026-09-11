import { createHash } from 'node:crypto';
import { mkdir, rm } from 'fs/promises';
import { join } from 'path';

import {
  addPngTextMetadata,
  DIST_PNG_METADATA,
  pngBytesToDataUrl,
} from '../data/png';
import type { ResolvedItem } from '../data/types';
import { TEXTURE_DATA_DIR } from '../data/versions';

export interface BuiltTexture {
  assetPath: string;
  dataUrl: string;
  sha256: string;
}

export interface BuiltTextureCatalog {
  bySourcePath: ReadonlyMap<string, BuiltTexture>;
  byAssetPath: ReadonlyMap<string, BuiltTexture>;
}

export async function buildTextures(
  options: { outputDir?: string } = {},
): Promise<BuiltTextureCatalog> {
  const outputDir = options.outputDir ?? './dist/textures/assets';
  const bySourcePath = new Map<string, BuiltTexture>();
  const byAssetPath = new Map<string, BuiltTexture>();

  await rm(outputDir, { recursive: true, force: true });
  await mkdir(outputDir, { recursive: true });

  const pngs = new Bun.Glob('**/*.png');
  for (const path of pngs.scanSync(TEXTURE_DATA_DIR)) {
    const sourcePath = join(TEXTURE_DATA_DIR, path);
    const sourceBytes = await Bun.file(sourcePath).bytes();
    const bytes = addPngTextMetadata(sourceBytes, DIST_PNG_METADATA);

    const sha256 = hashPng(bytes);
    const assetPath = `${sha256.slice(0, 16)}.png`;
    const existing = byAssetPath.get(assetPath);

    if (existing) {
      if (existing.sha256 !== sha256) {
        throw new Error(`Hash prefix collision for ${assetPath}`);
      }
      bySourcePath.set(sourcePath, existing);
      continue;
    }

    const texture = {
      assetPath,
      dataUrl: pngBytesToDataUrl(bytes),
      sha256,
    };

    await Bun.write(join(outputDir, assetPath), bytes);
    bySourcePath.set(sourcePath, texture);
    byAssetPath.set(assetPath, texture);
  }

  return { bySourcePath, byAssetPath };
}

export function requireBuiltTexture(
  catalog: BuiltTextureCatalog,
  item: ResolvedItem,
): BuiltTexture {
  const texture = catalog.bySourcePath.get(item.dataTexturePath);
  if (!texture) {
    throw new Error(`Missing built texture for ${item.id}`);
  }

  return texture;
}

function hashPng(bytes: Uint8Array): string {
  return createHash('sha256').update(bytes).digest('hex');
}

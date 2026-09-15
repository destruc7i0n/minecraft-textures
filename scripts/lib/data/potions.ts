import { readFileSync } from 'fs';

import type { PotionTexturesType } from '../../../lib/types';
import { resolveTextureAsset } from './resolver';
import {
  compareMinecraftVersions,
  dataVersionPath,
  POTION_DATA_DIR,
  TEXTURE_DATA_DIR,
} from './versions';

export function loadPotionVersion(
  version: string,
  { versionDir = POTION_DATA_DIR, textureDir = TEXTURE_DATA_DIR } = {},
): PotionTexturesType {
  if (!/^\d+(?:\.\d+)+$/.test(version)) {
    throw new Error(`Invalid potion version: ${version}`);
  }
  const file: PotionTexturesType = JSON.parse(
    readFileSync(dataVersionPath(version, versionDir), 'utf8'),
  );
  if (file.version !== version) {
    throw new Error(`Version mismatch in ${version}.json: ${file.version}`);
  }
  const identities = {
    potion: new Set<string>(),
    bedrockPotion: new Set<string>(),
  };
  for (const item of file.items) {
    resolveTextureAsset(item, textureDir);
    const textureVersion = item.texture.split('/')[0];
    if (compareMinecraftVersions(textureVersion, version) > 0) {
      throw new Error(
        `${version} cannot reference future texture ${item.texture}`,
      );
    }
    if (!item.potion && !item.bedrockPotion) {
      throw new Error(`${item.id} must define a potion identity`);
    }
    for (const field of ['potion', 'bedrockPotion'] as const) {
      const potion = item[field];
      if (potion === undefined) continue;
      const key = `${item.id}|${potion}`;
      if (identities[field].has(key)) {
        throw new Error(`Duplicate ${field} identity in ${version}: ${key}`);
      }
      identities[field].add(key);
    }
  }
  return file;
}

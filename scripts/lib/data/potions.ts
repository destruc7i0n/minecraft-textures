import type { Potion, PotionTexturesType } from '../../../lib/types';
import { resolveDataVersion } from './resolver';
import { POTION_DATA_DIR, TEXTURE_DATA_DIR } from './versions';

export function loadPotionVersion(
  version: string,
  { versionDir = POTION_DATA_DIR, textureDir = TEXTURE_DATA_DIR } = {},
): Pick<PotionTexturesType, 'version' | 'items'> {
  if (!/^\d+(?:\.\d+)+$/.test(version)) {
    throw new Error(`Invalid potion version: ${version}`);
  }
  const resolved = resolveDataVersion<Potion>(version, {
    versionDir,
    textureDir,
    keyOf: (item) => `${item.id}|${item.potion ?? item.bedrockPotion}`,
  });
  const file = {
    version,
    items: resolved.items.map((item) => {
      const source = { ...item };
      Reflect.deleteProperty(source, 'dataTexturePath');
      return source;
    }),
  };
  const identities = {
    potion: new Set<string>(),
    bedrockPotion: new Set<string>(),
  };
  for (const item of file.items) {
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

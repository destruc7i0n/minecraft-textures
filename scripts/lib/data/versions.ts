import { readdirSync } from 'fs';
import { join } from 'path';

export const DATA_DIR = './data';
export const VERSION_DATA_DIR = './data/versions';
export const TEXTURE_DATA_DIR = './data/textures';

export function compareMinecraftVersions(version1: string, version2: string) {
  const v1 = version1.split('.').map((el) => Number(el));
  const v2 = version2.split('.').map((el) => Number(el));
  const length = Math.max(v1.length, v2.length);

  for (let i = 0; i < length; i++) {
    const a = v1[i] ?? 0;
    const b = v2[i] ?? 0;
    if (a > b) return 1;
    if (a < b) return -1;
  }

  return 0;
}

export function discoverDataVersions(versionDir = VERSION_DATA_DIR): string[] {
  return readdirSync(versionDir)
    .filter((file) => file.endsWith('.json'))
    .map((file) => file.slice(0, -'.json'.length))
    .sort(compareMinecraftVersions);
}

export function dataVersionPath(
  version: string,
  versionDir = VERSION_DATA_DIR,
) {
  return join(versionDir, `${version}.json`);
}

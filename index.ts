/* TheDestruc7i0n 2025 */
import type { Last } from './lib/types';

export const textures = [
  '1.12',
  '1.13',
  '1.14',
  '1.15',
  '1.16',
  '1.17',
  '1.18',
  '1.19',
  '1.20',
  '1.21',
  '1.21.2',
  '1.21.4',
  '1.21.5',
  '1.21.6',
  // '1.21.7',
] as const;

export const versions = textures;
export const latestVersion: Last<typeof textures> = '1.21.6';

const hasVersion = (version: string) =>
  textures.includes(version as (typeof textures)[number]);

export type { TexturesType, TexturesTypeById, Item } from './lib/types';

export default hasVersion;

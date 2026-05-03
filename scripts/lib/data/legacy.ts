import { headers } from '../../../lib/constants';
import { pngToDataUrl } from './png';
import type { ResolvedVersion } from './types';

export interface LegacyJson {
  comment: string;
  items: LegacyItem[];
}

export interface LegacyItem {
  readable: string;
  id: string;
  texture: string;
}

export interface LegacyJsonById {
  comment: string;
  items: Record<string, { readable: string; texture: string }>;
}

export async function createLegacyJson(
  version: ResolvedVersion,
): Promise<LegacyJson> {
  return {
    comment: headers.comment,
    items: await Promise.all(
      version.items.map(async (item) => ({
        readable: item.readable,
        id: item.id,
        texture: await pngToDataUrl(item.dataTexturePath),
      })),
    ),
  };
}

export function createLegacyJsonById(legacy: LegacyJson): LegacyJsonById {
  return {
    comment: headers.comment,
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

export async function createLegacyIdJson(
  version: ResolvedVersion,
): Promise<LegacyJsonById> {
  return createLegacyJsonById(await createLegacyJson(version));
}

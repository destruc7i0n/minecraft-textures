import { headers } from '../../../lib/constants';
import type { ResolvedItem, ResolvedVersion } from './types';

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

export function createLegacyJson(
  version: ResolvedVersion,
  textureForItem: (item: ResolvedItem) => string,
): LegacyJson {
  return {
    comment: headers.comment,
    items: version.items.map((item) => ({
      readable: item.readable,
      id: item.id,
      texture: textureForItem(item),
    })),
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

import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

import type {
  DataItem,
  DataVersionFile,
  ResolvedItem,
  ResolvedVersion,
} from './types';
import {
  compareMinecraftVersions,
  dataVersionPath,
  TEXTURE_DATA_DIR,
  VERSION_DATA_DIR,
} from './versions';

export function defaultTextureName(id: string): string {
  return (
    id
      .replace(/^minecraft:/, '')
      .replaceAll(':', '_')
      .replaceAll('/', '_') + '.png'
  );
}

export function loadDataVersionFile<T extends DataItem = DataItem>(
  version: string,
  versionDir = VERSION_DATA_DIR,
): DataVersionFile<T> {
  return JSON.parse(
    readFileSync(dataVersionPath(version, versionDir), 'utf8'),
  ) as DataVersionFile<T>;
}

export function resolveDataVersion<T extends DataItem = DataItem>(
  version: string,
  options: {
    versionDir?: string;
    textureDir?: string;
    keyOf?: (item: T) => string;
  } = {},
): ResolvedVersion<T> {
  const versionDir = options.versionDir ?? VERSION_DATA_DIR;
  const textureDir = options.textureDir ?? TEXTURE_DATA_DIR;
  const keyOf = options.keyOf ?? ((item: T) => item.id);
  const resolving = new Set<string>();
  const cache = new Map<string, ResolvedVersion<T>>();

  const resolve = (targetVersion: string): ResolvedVersion<T> => {
    const cached = cache.get(targetVersion);
    if (cached) return cached;

    if (resolving.has(targetVersion)) {
      throw new Error(`Extends cycle detected at ${targetVersion}`);
    }
    resolving.add(targetVersion);

    const file = loadDataVersionFile<T>(targetVersion, versionDir);
    if (file.version !== targetVersion) {
      throw new Error(
        `Version mismatch in ${targetVersion}.json: ${file.version}`,
      );
    }

    if ('items' in file && 'extends' in file) {
      throw new Error(`${targetVersion} cannot define both items and extends`);
    }

    const ancestry = file.extends
      ? [...resolve(file.extends).ancestry, targetVersion]
      : [targetVersion];
    const rawItems = file.extends
      ? applyOverlay(targetVersion, resolve(file.extends), file, keyOf)
      : validateBaseItems(targetVersion, file, keyOf);
    const items = rawItems.map((item) => {
      const resolvedItem = resolveTextureAsset(item, textureDir);
      if (
        compareMinecraftVersions(item.texture.split('/')[0], targetVersion) > 0
      ) {
        throw new Error(
          `${targetVersion} cannot reference future texture ${item.texture}`,
        );
      }
      return resolvedItem;
    });
    const resolved = {
      version: targetVersion,
      extends: file.extends,
      ancestry,
      items,
    };

    resolving.delete(targetVersion);
    cache.set(targetVersion, resolved);
    return resolved;
  };

  return resolve(version);
}

function validateBaseItems<T extends DataItem>(
  version: string,
  file: DataVersionFile<T>,
  keyOf: (item: T) => string,
): T[] {
  if (!('items' in file) || !file.items) {
    throw new Error(`${version} must define items or extends`);
  }
  if ('add' in file || 'update' in file || 'remove' in file) {
    throw new Error(
      `${version} cannot define add, update, or remove without extends`,
    );
  }
  return applyOrder(file.items, file.order, keyOf);
}

function applyOverlay<T extends DataItem>(
  version: string,
  parent: ResolvedVersion<T>,
  file: Extract<DataVersionFile<T>, { extends: string }>,
  keyOf: (item: T) => string,
): T[] {
  const items: T[] = parent.items.map((item) => ({ ...item }));
  const inheritedIds = new Set(items.map(keyOf));

  for (const id of file.remove ?? []) {
    const index = items.findIndex((item) => keyOf(item) === id);
    if (index === -1) {
      throw new Error(`${version} cannot remove missing id ${id}`);
    }
    items.splice(index, 1);
  }

  for (const [id, update] of Object.entries(file.update ?? {})) {
    const index = items.findIndex((item) => keyOf(item) === id);
    if (index === -1) {
      throw new Error(`${version} cannot update missing id ${id}`);
    }
    const next = { ...items[index], ...update };
    if (
      keyOf(next) !== id &&
      items.some(
        (item, itemIndex) => itemIndex !== index && keyOf(item) === keyOf(next),
      )
    ) {
      throw new Error(
        `${version} cannot update ${id} to duplicate id ${keyOf(next)}`,
      );
    }
    items[index] = next;
  }

  const currentIds = new Set(items.map(keyOf));
  for (const item of file.add ?? []) {
    if (inheritedIds.has(keyOf(item))) {
      throw new Error(`${version} cannot add inherited id ${keyOf(item)}`);
    }
    if (currentIds.has(keyOf(item))) {
      throw new Error(`${version} cannot add duplicate id ${keyOf(item)}`);
    }
    currentIds.add(keyOf(item));
    items.push(item);
  }

  return applyOrder(items, file.order, keyOf);
}

function applyOrder<T extends DataItem>(
  items: T[],
  order: string[] | undefined,
  keyOf: (item: T) => string,
): T[] {
  if (!order) return items;

  const byId = new Map(items.map((item) => [keyOf(item), item]));
  const ordered: T[] = [];
  const seen = new Set<string>();

  for (const id of order) {
    const item = byId.get(id);
    if (!item) {
      throw new Error(`order references missing id ${id}`);
    }
    if (seen.has(id)) {
      throw new Error(`order contains duplicate id ${id}`);
    }
    ordered.push(item);
    seen.add(id);
  }

  for (const item of items) {
    if (!seen.has(keyOf(item))) ordered.push(item);
  }

  return ordered;
}

export function resolveTextureAsset<T extends DataItem>(
  item: T,
  textureDir: string,
): ResolvedItem<T> {
  const texture = requireTexturePath(item);
  const dataTexturePath = join(textureDir, texture);

  if (existsSync(dataTexturePath)) {
    return {
      ...item,
      texture,
      dataTexturePath,
    };
  }

  throw new Error(`Missing texture for ${item.id}: ${dataTexturePath}`);
}

function requireTexturePath(item: DataItem): string {
  if (!item.texture) {
    throw new Error(`${item.id} must define texture`);
  }
  if (!/^\d+(?:\.\d+)+\//.test(item.texture)) {
    throw new Error(
      `${item.id} texture must include a version folder: ${item.texture}`,
    );
  }
  if (
    item.texture.startsWith('/') ||
    item.texture.includes('..') ||
    !item.texture.endsWith('.png')
  ) {
    throw new Error(`${item.id} texture path is invalid: ${item.texture}`);
  }

  return item.texture;
}

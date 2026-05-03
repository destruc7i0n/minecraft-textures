import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

import type {
  DataItem,
  DataVersionFile,
  ResolvedItem,
  ResolvedVersion,
} from './types';
import {
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

export function loadDataVersionFile(
  version: string,
  versionDir = VERSION_DATA_DIR,
): DataVersionFile {
  return JSON.parse(
    readFileSync(dataVersionPath(version, versionDir), 'utf8'),
  ) as DataVersionFile;
}

export function resolveDataVersion(
  version: string,
  options: {
    versionDir?: string;
    textureDir?: string;
  } = {},
): ResolvedVersion {
  const versionDir = options.versionDir ?? VERSION_DATA_DIR;
  const textureDir = options.textureDir ?? TEXTURE_DATA_DIR;
  const resolving = new Set<string>();
  const cache = new Map<string, ResolvedVersion>();

  const resolve = (targetVersion: string): ResolvedVersion => {
    const cached = cache.get(targetVersion);
    if (cached) return cached;

    if (resolving.has(targetVersion)) {
      throw new Error(`Extends cycle detected at ${targetVersion}`);
    }
    resolving.add(targetVersion);

    const file = loadDataVersionFile(targetVersion, versionDir);
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
      ? applyOverlay(targetVersion, resolve(file.extends), file)
      : validateBaseItems(targetVersion, file);
    const items = rawItems.map((item) =>
      resolveTextureAsset(item, ancestry, textureDir),
    );
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

function validateBaseItems(version: string, file: DataVersionFile): DataItem[] {
  if (!('items' in file) || !file.items) {
    throw new Error(`${version} must define items or extends`);
  }
  if ('add' in file || 'update' in file || 'remove' in file) {
    throw new Error(
      `${version} cannot define add, update, or remove without extends`,
    );
  }
  return applyOrder(file.items, file.order);
}

function applyOverlay(
  version: string,
  parent: ResolvedVersion,
  file: Extract<DataVersionFile, { extends: string }>,
): DataItem[] {
  const items = parent.items.map<DataItem>((item) => ({
    id: item.id,
    readable: item.readable,
    texture: item.texture.split('/').slice(1).join('/'),
  }));
  const inheritedIds = new Set(items.map((item) => item.id));

  for (const id of file.remove ?? []) {
    const index = items.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new Error(`${version} cannot remove missing id ${id}`);
    }
    items.splice(index, 1);
  }

  for (const [id, update] of Object.entries(file.update ?? {})) {
    const index = items.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new Error(`${version} cannot update missing id ${id}`);
    }
    const next = { ...items[index], ...update };
    if (
      update.id &&
      update.id !== id &&
      items.some(
        (item, itemIndex) => itemIndex !== index && item.id === update.id,
      )
    ) {
      throw new Error(
        `${version} cannot update ${id} to duplicate id ${update.id}`,
      );
    }
    items[index] = next;
  }

  const currentIds = new Set(items.map((item) => item.id));
  for (const item of file.add ?? []) {
    if (inheritedIds.has(item.id)) {
      throw new Error(`${version} cannot add inherited id ${item.id}`);
    }
    if (currentIds.has(item.id)) {
      throw new Error(`${version} cannot add duplicate id ${item.id}`);
    }
    currentIds.add(item.id);
    items.push(item);
  }

  return applyOrder(items, file.order);
}

function applyOrder(
  items: DataItem[],
  order: string[] | undefined,
): DataItem[] {
  if (!order) return items;

  const byId = new Map(items.map((item) => [item.id, item]));
  const ordered: DataItem[] = [];
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
    if (!seen.has(item.id)) ordered.push(item);
  }

  return ordered;
}

function resolveTextureAsset(
  item: DataItem,
  ancestry: string[],
  textureDir: string,
): ResolvedItem {
  const name = item.texture ?? defaultTextureName(item.id);

  for (const version of [...ancestry].reverse()) {
    const dataTexturePath = join(textureDir, version, name);
    if (existsSync(dataTexturePath)) {
      return {
        id: item.id,
        readable: item.readable,
        texture: `${version}/${name}`,
        dataTexturePath,
      };
    }
  }

  throw new Error(`Missing texture for ${item.id}: ${name}`);
}

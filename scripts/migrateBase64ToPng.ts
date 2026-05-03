import { mkdirSync } from 'fs';
import { dirname, join } from 'path';

import { textures } from '../index';
import type { Item, TexturesType } from '../lib/types';
import { dataUrlToPng } from './lib/data/png';
import { defaultTextureName } from './lib/data/resolver';
import type { DataItem, DataVersionFile } from './lib/data/types';

const DATA_VERSION_DIR = './data/versions';
const DATA_TEXTURE_DIR = './data/textures';
const LEGACY_DIST_DIR = process.env.LEGACY_DIST_DIR ?? './dist';
const FULL_VERSION_FILES = new Set(['1.12', '1.13']);
const usedTextureNamesByVersion = new Map<string, Map<string, string>>();

const toDataItem = (item: Item, textureName: string): DataItem => {
  return {
    id: item.id,
    readable: item.readable,
    texture: textureName,
  };
};

const writeJson = async (path: string, value: unknown) => {
  mkdirSync(dirname(path), { recursive: true });
  await Bun.write(path, `${JSON.stringify(value, null, 2)}\n`);
};

const allocateTextureName = (version: string, item: Item) => {
  const defaultName = defaultTextureName(item.id);
  const used =
    usedTextureNamesByVersion.get(version) ?? new Map<string, string>();
  usedTextureNamesByVersion.set(version, used);

  const existing = used.get(defaultName);
  if (!existing) {
    used.set(defaultName, item.texture);
    return defaultName;
  }
  if (existing === item.texture) {
    return defaultName;
  }

  const extension = '.png';
  const baseName = defaultName.slice(0, -extension.length);
  for (let i = 2; ; i++) {
    const candidate = `${baseName}_${i}${extension}`;
    const candidateExisting = used.get(candidate);
    if (!candidateExisting) {
      used.set(candidate, item.texture);
      return candidate;
    }
    if (candidateExisting === item.texture) {
      return candidate;
    }
  }
};

const writePng = async (version: string, item: Item) => {
  const fileName = allocateTextureName(version, item);
  const path = join(DATA_TEXTURE_DIR, version, fileName);
  mkdirSync(dirname(path), { recursive: true });
  await Bun.write(path, dataUrlToPng(item.texture));
  return fileName;
};

const bytesEqual = (a: Uint8Array, b: Uint8Array) =>
  a.length === b.length && a.every((byte, index) => byte === b[index]);

const sameTexture = (a: string, b: string) =>
  bytesEqual(dataUrlToPng(a), dataUrlToPng(b));

const sameIds = (a: string[], b: string[]) =>
  a.length === b.length && a.every((id, index) => id === b[index]);

const textureNameChanged = (a: string | undefined, b: string | undefined) =>
  a !== b;

const cloneItems = (items: Item[]): Item[] =>
  items.map((item) => ({
    readable: item.readable,
    id: item.id,
    texture: item.texture,
  }));

const loadVersionItems = async (version: string): Promise<Item[]> => {
  const legacyJson = Bun.file(
    `${LEGACY_DIST_DIR}/textures/json/${version}.json`,
  );
  if (await legacyJson.exists()) {
    const texturesForVersion = (await legacyJson.json()) as TexturesType;
    return cloneItems(texturesForVersion.items);
  }

  throw new Error(
    `Missing legacy JSON for ${version}. Set LEGACY_DIST_DIR to the pre-migration dist directory.`,
  );
};

const main = async () => {
  mkdirSync(DATA_VERSION_DIR, { recursive: true });
  mkdirSync(DATA_TEXTURE_DIR, { recursive: true });

  let previousItems: Item[] | undefined;
  let previousVersion: string | undefined;
  let previousTextureNameById = new Map<string, string>();

  for (const version of textures) {
    const currentItems = await loadVersionItems(version);
    const isFullVersionFile = FULL_VERSION_FILES.has(version);
    const currentTextureNameById = new Map<string, string>();

    if (!previousItems || !previousVersion || isFullVersionFile) {
      const items: DataItem[] = [];
      for (const item of currentItems) {
        const textureName = await writePng(version, item);
        currentTextureNameById.set(item.id, textureName);
        items.push(toDataItem(item, textureName));
      }
      const file: DataVersionFile = {
        version,
        items,
      };
      await writeJson(join(DATA_VERSION_DIR, `${version}.json`), file);
      previousItems = currentItems;
      previousVersion = version;
      previousTextureNameById = currentTextureNameById;
      continue;
    }

    const previousById = new Map(previousItems.map((item) => [item.id, item]));
    const currentById = new Map(currentItems.map((item) => [item.id, item]));

    const add: DataItem[] = [];
    const update: Record<string, Partial<DataItem>> = {};
    const remove: string[] = [];

    for (const item of previousItems) {
      if (!currentById.has(item.id)) remove.push(item.id);
    }

    for (const item of currentItems) {
      const previousItem = previousById.get(item.id);
      if (!previousItem) {
        const textureName = await writePng(version, item);
        currentTextureNameById.set(item.id, textureName);
        add.push(toDataItem(item, textureName));
        continue;
      }

      const itemUpdate: Partial<DataItem> = {};
      let textureName =
        previousTextureNameById.get(item.id) ?? defaultTextureName(item.id);
      if (item.readable !== previousItem.readable) {
        itemUpdate.readable = item.readable;
      }
      if (!sameTexture(item.texture, previousItem.texture)) {
        textureName = await writePng(version, item);
      }
      currentTextureNameById.set(item.id, textureName);

      const previousTextureName = previousTextureNameById.get(item.id);
      if (textureNameChanged(textureName, previousTextureName)) {
        itemUpdate.texture = textureName;
      }
      if (Object.keys(itemUpdate).length > 0) {
        update[item.id] = itemUpdate;
      }
    }

    const currentIds = currentItems.map((item) => item.id);
    const addIds = new Set(add.map((item) => item.id));
    const defaultOverlayIds = [
      ...previousItems
        .map((item) => item.id)
        .filter((id) => currentById.has(id) && !remove.includes(id)),
      ...currentItems.map((item) => item.id).filter((id) => addIds.has(id)),
    ];

    const file: DataVersionFile = {
      version,
      extends: previousVersion,
      ...(add.length > 0 ? { add } : {}),
      ...(Object.keys(update).length > 0 ? { update } : {}),
      ...(remove.length > 0 ? { remove } : {}),
      ...(!sameIds(currentIds, defaultOverlayIds) ? { order: currentIds } : {}),
    };

    await writeJson(join(DATA_VERSION_DIR, `${version}.json`), file);
    previousItems = currentItems;
    previousVersion = version;
    previousTextureNameById = currentTextureNameById;
  }
};

main();

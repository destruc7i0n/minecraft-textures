import * as core from '@actions/core';
import { mkdir, rm } from 'fs/promises';

import { latestVersion } from '../index';
import { ItemTextures } from './lib/item-textures';
import type { DataItem, DataVersionFile } from './lib/data/types';
import { ITEMS_FILE, VERSION_FILE } from './lib/mcmeta';
import {
  defaultTextureName,
  loadDataVersionFile,
  resolveDataVersion,
} from './lib/data/resolver';
import { getTranslationFromId } from './lib/translations';

const MISSING_TEXTURE_DIR = './debug/missing-textures';

const main = async () => {
  await rm(MISSING_TEXTURE_DIR, { recursive: true, force: true });

  const remoteLatestVersion = (
    (await (await fetch(VERSION_FILE)).json()) as { id: string }
  ).id;
  console.log(
    `Comparing (local) items from ${latestVersion} to (remote) ${remoteLatestVersion}`,
  );

  const allItems = (await (await fetch(ITEMS_FILE)).json()) as string[];
  const remoteIds = allItems.filter((id) => id !== 'air');
  const latest = resolveDataVersion(latestVersion);
  const ids = latest.items.map((i) => i.id.replace('minecraft:', ''));

  const missingIds = remoteIds.filter((v) => !ids.includes(v));
  const removedIds = ids.filter((v) => !remoteIds.includes(v) && v !== 'air');
  const duplicateIds = ids.filter((v, i) => ids.indexOf(v) !== i);

  if (missingIds.length > 0) {
    const missingItems: DataItem[] = [];
    for (const id of missingIds) {
      const fallbackReadable =
        id
          .split('_')
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ') + ' [verify]';
      const translationData = await getTranslationFromId(id);
      missingItems.push(
        toDataItem(id, translationData?.readable ?? fallbackReadable),
      );
    }

    const itemTextures = new ItemTextures();
    await itemTextures.initialize();
    const unableToFetch = await writeMissingTextureFolder({
      itemTextures,
      targetVersion: remoteLatestVersion,
      missingItems,
      removedIds: removedIds.map((id) => `minecraft:${id}`),
    });

    const message = `${missingIds.length} missing items.`;
    console.log(message);
    console.log(`Wrote ${MISSING_TEXTURE_DIR}`);
    console.log(
      `Version file: ${MISSING_TEXTURE_DIR}/data/versions/${remoteLatestVersion}.json`,
    );
    console.log(
      `Fetched textures: ${missingItems.length - unableToFetch.length}/${missingItems.length}`,
    );
    logMissingItems(remoteLatestVersion, missingItems, unableToFetch);
    if (unableToFetch.length > 0) {
      console.log(
        `Could not fetch ${unableToFetch.length} textures. See ${MISSING_TEXTURE_DIR}/unable-to-fetch.txt`,
      );
    }

    if (process.env.GITHUB_ACTIONS) {
      core.error(message);
    }
  }

  if (removedIds.length > 0) {
    console.log(`${removedIds.length} removed items.`);
    for (const id of removedIds) {
      console.log(`- minecraft:${id}`);
    }
  }

  if (duplicateIds.length > 0) {
    console.log(`${duplicateIds.length} duplicate items.`);
    console.log(JSON.stringify(duplicateIds, null, 2));
  }

  if (duplicateIds.length > 0 || missingIds.length > 0) {
    process.exit(1);
  }
};

main();

interface MissingTextureFolderOptions {
  itemTextures: ItemTextures;
  targetVersion: string;
  missingItems: DataItem[];
  removedIds: string[];
}

async function writeMissingTextureFolder({
  itemTextures,
  targetVersion,
  missingItems,
  removedIds,
}: MissingTextureFolderOptions) {
  const textureDir = `${MISSING_TEXTURE_DIR}/data/textures/${targetVersion}`;
  const versionFile = createMissingVersionFile({
    targetVersion,
    missingItems,
    removedIds,
  });
  const unableToFetch: string[] = [];

  await mkdir(`${MISSING_TEXTURE_DIR}/data/versions`, { recursive: true });
  await mkdir(textureDir, { recursive: true });
  await Bun.write(
    `${MISSING_TEXTURE_DIR}/data/versions/${targetVersion}.json`,
    `${JSON.stringify(versionFile, null, 2)}\n`,
  );

  for (const item of missingItems) {
    const relativePath = `data/textures/${targetVersion}/${item.texture}`;
    const texture = await itemTextures.getImageBufferById(
      `item/${item.id.replace('minecraft:', '')}`,
    );

    if (texture) {
      await Bun.write(
        `${MISSING_TEXTURE_DIR}/${relativePath}`,
        new Uint8Array(texture),
      );
    } else {
      unableToFetch.push(relativePath);
    }
  }

  await Bun.write(
    `${MISSING_TEXTURE_DIR}/unable-to-fetch.txt`,
    unableToFetch.length > 0 ? `${unableToFetch.join('\n')}\n` : '',
  );

  return unableToFetch;
}

function logMissingItems(
  targetVersion: string,
  missingItems: DataItem[],
  unableToFetch: string[],
) {
  const missingTexturePaths = new Set(unableToFetch);

  console.log('Missing items:');
  for (const item of missingItems) {
    const texturePath = `data/textures/${targetVersion}/${item.texture}`;
    const textureStatus = missingTexturePaths.has(texturePath)
      ? 'not fetched'
      : 'fetched';
    console.log(
      `- ${item.id} (${item.readable}) -> ${texturePath} [${textureStatus}]`,
    );
  }
}

function createMissingVersionFile({
  targetVersion,
  missingItems,
  removedIds,
}: Omit<MissingTextureFolderOptions, 'itemTextures'>): DataVersionFile {
  if (targetVersion === latestVersion) {
    const current = loadDataVersionFile(latestVersion);
    if ('items' in current) {
      return withRemovedIds(
        {
          ...current,
          items: mergeUniqueItems(current.items, missingItems),
        },
        removedIds,
      );
    }

    const next = {
      ...current,
      add: mergeUniqueItems(current.add ?? [], missingItems),
    };
    return withRemovedIds(next, removedIds);
  }

  return withRemovedIds(
    {
      version: targetVersion,
      extends: latestVersion,
      add: missingItems,
    },
    removedIds,
  );
}

function toDataItem(id: string, readable: string): DataItem {
  const fullId = `minecraft:${id}`;
  return {
    id: fullId,
    readable,
    texture: defaultTextureName(fullId),
  };
}

function mergeUniqueItems(existing: DataItem[], additions: DataItem[]) {
  const seen = new Set(existing.map((item) => item.id));
  return [
    ...existing,
    ...additions.filter((item) => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    }),
  ];
}

function mergeUnique(existing: string[] | undefined, additions: string[]) {
  return Array.from(new Set([...(existing ?? []), ...additions]));
}

function withRemovedIds<T extends DataVersionFile>(
  versionFile: T,
  removedIds: string[],
): T {
  const remove = mergeUnique(versionFile.remove, removedIds);
  return remove.length > 0 ? { ...versionFile, remove } : versionFile;
}

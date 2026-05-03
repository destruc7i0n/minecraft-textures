import * as core from '@actions/core';

import type { DataItem } from './lib/data/types';
import { ITEMS_FILE, VERSION_FILE } from './lib/mcmeta';
import { defaultTextureName, resolveDataVersion } from './lib/data/resolver';
import { discoverDataVersions } from './lib/data/versions';
import { getTranslationFromId } from './lib/translations';

const main = async () => {
  const latestVersion = discoverDataVersions().at(-1);
  if (!latestVersion) throw new Error('No data versions found');

  const remoteLatestVersion = (
    (await (await fetch(VERSION_FILE)).json()) as { id: string }
  ).id;
  console.log(
    `Comparing (local) items from ${latestVersion} to (remote) ${remoteLatestVersion}`,
  );

  const allItems = (await (await fetch(ITEMS_FILE)).json()) as string[];
  const latest = resolveDataVersion(latestVersion);
  const ids = latest.items.map((i) => i.id.replace('minecraft:', ''));

  const diff = allItems.filter((v) => !ids.includes(v) && v !== 'air');
  const removed = ids.filter((v) => !allItems.includes(v) && v !== 'air');
  const dupes = ids.filter((v, i) => ids.indexOf(v) !== i);

  if (diff.length > 0) {
    const suggestedAdd: DataItem[] = [];
    for (const id of diff) {
      const fallbackReadable =
        id
          .split('_')
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ') + ' [verify]';
      const translationData = await getTranslationFromId(id);
      suggestedAdd.push({
        readable: translationData?.readable ?? fallbackReadable,
        id: `minecraft:${id}`,
        texture: defaultTextureName(`minecraft:${id}`),
      });
    }

    const message = `There are ${diff.length} missing items.`;
    console.log(message);
    console.log(JSON.stringify({ add: suggestedAdd }, null, 2));

    if (process.env.GITHUB_ACTIONS) {
      core.error(message);
    }
  }

  if (removed.length > 0) {
    console.log(`There are ${removed.length} removed items.`);
    console.log(
      JSON.stringify(
        { remove: removed.map((id) => `minecraft:${id}`) },
        null,
        2,
      ),
    );
  }

  if (dupes.length > 0) {
    console.log(`There are ${dupes.length} duplicate items.`);
    console.log(JSON.stringify(dupes, null, 2));
  }

  if (dupes.length > 0 || diff.length > 0) {
    process.exit(1);
  }
};

main();

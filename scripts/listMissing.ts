import * as core from '@actions/core';

import type { Item, TexturesType } from '../lib/types';
import { latestVersion } from '../index';
import { ITEMS_FILE, VERSION_FILE } from './lib/mcmeta';
import { getTranslationFromId } from './lib/translations';
import { ItemTextures } from './lib/item-textures';

// lists all the missing items, probably from a new version
const main = async () => {
  const remoteLatestVersion = (
    (await (await fetch(VERSION_FILE)).json()) as { id: string }
  ).id;
  console.log(
    `Comparing (local) items from ${latestVersion} to (remote) ${remoteLatestVersion}`
  );

  const allItems = (await (await fetch(ITEMS_FILE)).json()) as string[];

  const latest: TexturesType = (await import(`../textures/${latestVersion}.ts`))
    .default;
  const ids = latest.items.map((i) => i.id.replace('minecraft:', ''));

  // compare files and exclude air
  const diff = allItems.filter((v) => !ids.includes(v) && v !== 'air');
  const removed = ids.filter((v) => !allItems.includes(v) && v !== 'air');
  const dupes = ids.filter((v, i) => ids.indexOf(v) !== i);

  let missingCount = diff.length;

  if (diff.length > 0) {
    const itemTextures = new ItemTextures();
    await itemTextures.initialize();

    const texturesBootstrap: Partial<Item>[] = [];
    for (const id of diff) {
      // basic readable name from the id, needs to be verified
      const fallbackReadable =
        id
          .split('_')
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1)) // make first letter uppercase
          .join(' ') + ' [verify]';

      let texture = '';

      const translationData = await getTranslationFromId(id);

      const textureBuffer = await itemTextures.getImageBufferById(`item/${id}`);
      if (textureBuffer) {
        console.log(`Found texture for ${id}`);
        texture = `data:image/png;base64,${textureBuffer.toString('base64')}`;
        missingCount--;
      }

      texturesBootstrap.push({
        readable: translationData?.readable ?? fallbackReadable,
        id: `minecraft:${id}`,
        texture,
      });
    }

    const message = `There are ${missingCount} missing textures.`;
    console.log(message);
    console.log(JSON.stringify(texturesBootstrap, null, 2));

    if (process.env.GITHUB_ACTIONS) {
      core.error(message);

      core.summary
        .addHeading('Missing Items', 1)
        .addTable([
          [
            {
              data: 'ID',
              header: true,
            },
            {
              data: 'Display Name',
              header: true,
            },
          ],
          ...texturesBootstrap.map((t) => [
            {
              data: t.id ?? 'unknown',
            },
            { data: t.readable ?? 'unknown' },
          ]),
        ])
        .write();
    }
  }

  if (removed.length > 0) {
    console.log(`There are ${removed.length} removed items.`);
    console.log(JSON.stringify(removed, null, 2));
  }

  if (dupes.length > 0) {
    console.log(`There are ${dupes.length} duplicate items.`);
    console.log(JSON.stringify(dupes, null, 2));
  }

  if (dupes.length > 0 || missingCount > 0) {
    process.exit(1);
  }
};

main();

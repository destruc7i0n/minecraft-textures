import fetch from 'node-fetch';

import type { Item, TexturesType } from '../lib/types';
import { latestVersion } from '../index';
import { ITEMS_FILE, VERSION_FILE } from './lib/mcmeta';
import { getTranslationFromId } from './lib/translations';
import { ItemTextures } from './lib/item-textures';

// lists all the missing items, probably from a new version
const main = async () => {
  const remoteLatestVersion = (await (await fetch(VERSION_FILE)).json()).id;
  console.log(
    `Comparing (local) items from ${latestVersion} to (remote) ${remoteLatestVersion}`
  );

  const allItems = (await (await fetch(ITEMS_FILE)).json()) as string[];

  const latest: TexturesType = (await import(`../textures/${latestVersion}.ts`))
    .default;
  const ids = latest.items.map((i) => i.id.replace('minecraft:', ''));

  // compare files and exclude air
  const diff = allItems.filter((v) => !ids.includes(v) && v !== 'air');

  let missingCount = diff.length;

  console.log(`Found ${diff.length} missing items.`);
  if (diff.length === 0) return;

  const itemTextures = new ItemTextures();
  await itemTextures.initialize();

  const texturesBootstrap: Partial<Item>[] = [];
  for (const id of diff) {
    // basic readable name from the id, needs to be verified
    const fallbackReadable =
      id
        .replace('minecraft:', '')
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
      id,
      readable: translationData?.readable ?? fallbackReadable,
      texture,
    });
  }

  console.log(JSON.stringify(texturesBootstrap, null, 2));
  console.log(`There are ${missingCount} missing textures left.`);
};

main();

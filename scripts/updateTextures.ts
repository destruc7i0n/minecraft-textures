// Usage: bun run update-textures [--output=./changed-textures.json] [--version=1.21.11]

import * as core from '@actions/core';
// @ts-expect-error - parseArgs is available in Bun but TypeScript types may not include it yet
import { parseArgs } from 'util';

import type { TexturesType } from '../lib/types';
import { latestVersion } from '../index';
import { ItemTextures } from './lib/item-textures';
import { compareImages } from './lib/image-comparison';
import { ITEMS_FILE } from './lib/mcmeta';

interface TextureChange {
  id: string;
  readable: string;
  similarity: number;
  currentTexture: string;
  remoteTexture: string | null;
  needsUpdate: boolean;
}

const main = async () => {
  const { values } = parseArgs({
    args: Bun.argv,
    options: {
      output: { type: 'string', short: 'o' },
      version: { type: 'string', short: 'v' },
    },
    strict: false,
    allowPositionals: true,
  });

  const outputFile = values.output || './tmp/changed-textures.json';
  const targetVersion = values.version || latestVersion;

  console.log(`Checking for texture changes in version ${targetVersion}...`);
  console.log(`Output file: ${outputFile}\n`);

  const latest: TexturesType = (await import(`../textures/${targetVersion}.ts`))
    .default;

  const allItemsResponse = await fetch(ITEMS_FILE);
  if (!allItemsResponse.ok) {
    throw new Error(`Failed to fetch items: HTTP ${allItemsResponse.status}`);
  }
  const allItems = (await allItemsResponse.json()) as string[];

  const itemTextures = new ItemTextures();
  await itemTextures.initialize();

  const changedTextures: TextureChange[] = [];

  const existingItems = latest.items.filter((item) => {
    const idWithoutPrefix = item.id.replace('minecraft:', '');
    return allItems.includes(idWithoutPrefix) && idWithoutPrefix !== 'air';
  });

  console.log(
    `Checking ${existingItems.length} items for texture changes...\n`
  );

  let checkedCount = 0;
  for (const item of existingItems) {
    if (!item.texture) continue;

    const remoteId = item.id.replace('minecraft:', '');
    const remoteTextureBuffer = await itemTextures.getImageBufferById(
      `item/${remoteId}`
    );

    if (remoteTextureBuffer) {
      checkedCount++;
      const { identical, similarity } = await compareImages(
        item.texture,
        remoteTextureBuffer
      );

      if (!identical) {
        const remoteBase64 = `data:image/png;base64,${remoteTextureBuffer.toString(
          'base64'
        )}`;

        changedTextures.push({
          id: item.id,
          readable: item.readable,
          similarity,
          currentTexture: item.texture,
          remoteTexture: remoteBase64,
          needsUpdate: true,
        });

        console.log(
          `  ⚠️  ${item.id} (${item.readable}): ${similarity.toFixed(
            2
          )}% similar`
        );
      }
    }
  }

  console.log(`\nChecked ${checkedCount} items.`);

  if (changedTextures.length === 0) {
    console.log('✓ No texture changes detected.');
  } else {
    const message = `There are ${changedTextures.length} items with changed textures.`;
    console.log(`\n${message}`);
    console.log('Changed textures:');
    changedTextures.forEach((t) => {
      console.log(
        `  ${t.id} (${t.readable}): ${t.similarity.toFixed(2)}% similar`
      );
    });

    console.log(`\nWriting changed textures to: ${outputFile}`);
    await Bun.write(outputFile, JSON.stringify(changedTextures, null, 2));

    if (process.env.GITHUB_ACTIONS) {
      core.error(message);

      await core.summary
        .addHeading('Changed Textures', 1)
        .addTable([
          [
            {
              data: 'ID',
              header: true,
            },
            {
              data: 'Readable',
              header: true,
            },
            {
              data: 'Similarity',
              header: true,
            },
          ],
          ...changedTextures.map((t) => [
            {
              data: t.id ? `<pre><code>${t.id}</code></pre>` : 'unknown',
            },
            { data: t.readable ?? 'unknown' },
            { data: `${t.similarity.toFixed(2)}%` },
          ]),
        ])
        .write();
    }

    process.exit(1);
  }
};

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

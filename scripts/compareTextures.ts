import type { TexturesType } from '../lib/types';
import { ItemTextures } from './lib/item-textures';
import { compareImages } from './lib/image-comparison';

interface ComparisonResult {
  id: string;
  readable: string;
  similarity: number;
}

async function compareVersions(
  version1: string,
  version2: string
): Promise<void> {
  console.log(`Comparing textures between ${version1} and ${version2}...`);

  try {
    const textures1: TexturesType = (await import(`../textures/${version1}.ts`))
      .default;
    const textures2: TexturesType = (await import(`../textures/${version2}.ts`))
      .default;

    const results: ComparisonResult[] = [];

    const itemMap1 = new Map(textures1.items.map((item) => [item.id, item]));
    const itemMap2 = new Map(textures2.items.map((item) => [item.id, item]));

    for (const [id, item1] of itemMap1) {
      const item2 = itemMap2.get(id);
      if (item2 && item1.texture && item2.texture) {
        const { identical, similarity } = await compareImages(
          item1.texture,
          item2.texture
        );
        if (!identical) {
          results.push({
            id,
            readable: item2.readable,
            similarity,
          });
        }
      }
    }

    if (results.length === 0) {
      console.log('No texture differences found between versions.');
    } else {
      console.log(`Found ${results.length} items with different textures:`);
      console.log('\nChanged textures:');
      results.forEach((result) => {
        console.log(
          `  ${result.id} (${result.readable}): ${result.similarity.toFixed(
            2
          )}% similar`
        );
      });
    }

    const newItems = Array.from(itemMap2.keys()).filter(
      (id) => !itemMap1.has(id)
    );
    const removedItems = Array.from(itemMap1.keys()).filter(
      (id) => !itemMap2.has(id)
    );

    if (newItems.length > 0) {
      console.log(`\nNew items in ${version2}: ${newItems.length}`);
      newItems.forEach((id) => {
        const item = itemMap2.get(id)!;
        console.log(`  ${id} (${item.readable})`);
      });
    }

    if (removedItems.length > 0) {
      console.log(`\nRemoved items from ${version1}: ${removedItems.length}`);
      removedItems.forEach((id) => {
        const item = itemMap1.get(id)!;
        console.log(`  ${id} (${item.readable})`);
      });
    }
  } catch (error) {
    console.error('Error comparing versions:', error);
  }
}

async function compareWithRemote(version: string): Promise<void> {
  console.log(`Comparing local textures (${version}) with remote textures...`);

  try {
    const localTextures: TexturesType = (
      await import(`../textures/${version}.ts`)
    ).default;
    const itemTextures = new ItemTextures();
    await itemTextures.initialize();

    const results: ComparisonResult[] = [];
    let checkedCount = 0;
    let missingRemote = 0;

    for (const item of localTextures.items) {
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
          results.push({
            id: item.id,
            readable: item.readable,
            similarity,
          });
        }
      } else {
        missingRemote++;
      }
    }

    console.log(`\nChecked ${checkedCount} textures against remote atlas.`);
    if (missingRemote > 0) {
      console.log(`${missingRemote} items not found in remote atlas.`);
    }

    if (results.length === 0) {
      console.log('All local textures match remote textures.');
    } else {
      console.log(`Found ${results.length} items with different textures:`);
      results.forEach((result) => {
        console.log(
          `  ${result.id} (${result.readable}): ${result.similarity.toFixed(
            2
          )}% similar`
        );
      });
    }
  } catch (error) {
    console.error('Error comparing with remote:', error);
  }
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('Usage:');
    console.log(
      '  Compare two versions: bun run compare-textures <version1> <version2>'
    );
    console.log(
      '  Compare with remote: bun run compare-textures --remote <version>'
    );
    console.log('\nExamples:');
    console.log('  bun run compare-textures 1.21.6 1.21.7');
    console.log('  bun run compare-textures --remote 1.21.7');
    return;
  }

  if (args[0] === '--remote' && args[1]) {
    await compareWithRemote(args[1]);
  } else if (args.length >= 2) {
    await compareVersions(args[0], args[1]);
  } else {
    console.error('Invalid arguments. Run without arguments to see usage.');
  }
}

main();

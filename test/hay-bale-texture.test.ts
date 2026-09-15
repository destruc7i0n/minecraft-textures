import { expect, test } from 'bun:test';
import { createHash } from 'crypto';
import { createCanvas, loadImage } from 'canvas';

import { resolveDataVersion } from '../scripts/lib/data/resolver';

// Independent final 26.3 client captures, GUI scale 2, native 32×32.
// Client SHA1: e877b6a07acd633fb3bb475002175cec036e7b87.
// Hashes cover RGBA pixels on opaque black/white backgrounds, not PNG encoding.
// The original 26.3 source PNG was blurred before packaging; both comparisons
// reject it and prevent the catalog from reverting to a different source image.
test('26.3 hay bale matches final-client inventory pixels', async () => {
  const item = resolveDataVersion('26.3').items.find(
    (item) => item.id === 'minecraft:hay_block',
  );
  expect(item).toBeDefined();
  const image = await loadImage(item!.dataTexturePath);
  expect([image.width, image.height]).toEqual([32, 32]);
  const backgrounds = {
    black: '459e9676fc5fbc4db352e8937cbba8415f03e2d2e0c4003e2cc5c487e3877a40',
    white: '3ec6a6e1ee65c3669243ddb0fee35af2d57dee773ddfa4fa01b62eeb8fa1dae6',
  };
  for (const [background, expected] of Object.entries(backgrounds)) {
    const context = createCanvas(32, 32).getContext('2d');
    context.fillStyle = background;
    context.fillRect(0, 0, 32, 32);
    context.drawImage(image, 0, 0);
    const pixels = context.getImageData(0, 0, 32, 32).data;
    expect(createHash('sha256').update(pixels).digest('hex')).toBe(expected);
  }
});

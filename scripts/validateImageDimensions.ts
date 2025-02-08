import * as core from '@actions/core';

import { createCanvas, loadImage, type Image } from 'canvas';

import type { TexturesType, Item } from '../lib/types';
import { latestVersion } from '../index';

const expectedDimension = 32;

const main = async () => {
  const latest: TexturesType = (await import(`../textures/${latestVersion}.ts`))
    .default;

  const invalidImages: string[] = [];
  const invalidDimensions: string[] = [];
  const resizedImages: Item[] = [];

  for (const item of latest.items) {
    let image: Image;
    try {
      image = await loadImage(item.texture);
    } catch (e) {
      invalidImages.push(item.id);
      continue;
    }

    const { width, height } = image;

    if (width !== expectedDimension || height !== expectedDimension) {
      console.log(`${item.id} is ${width}x${height}`);
      invalidDimensions.push(item.id);
    } else {
      continue;
    }

    if (width !== expectedDimension || height !== expectedDimension) {
      // resize the image to the expected dimension
      const canvas = createCanvas(expectedDimension, expectedDimension);
      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(image, 0, 0, expectedDimension, expectedDimension);
      item.texture = canvas.toDataURL();
      resizedImages.push(item);
    } else {
      console.log(
        `${item.id} is not a multiple of ${expectedDimension}. Skipped resizing.`
      );
    }
  }

  if (invalidImages.length) {
    const message = `Found ${invalidImages.length} invalid images.`;
    console.log(message);
    console.log(JSON.stringify(invalidImages, null, 2));
    if (process.env.GITHUB_ACTIONS) {
      core.error(message);
    }
  }
  if (invalidDimensions.length) {
    const message = `Found ${invalidDimensions.length} images not ${expectedDimension}x${expectedDimension}.`;
    console.log(message);
    console.log(JSON.stringify(resizedImages, null, 2));
    if (process.env.GITHUB_ACTIONS) {
      core.warning(message);
    }
  }

  if (invalidImages.length > 0 || invalidDimensions.length > 0) {
    process.exit(1);
  }
};

main();

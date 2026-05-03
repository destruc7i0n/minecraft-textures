import * as core from '@actions/core';

import { loadImage } from 'canvas';

import { resolveDataVersion } from './lib/data/resolver';
import { discoverDataVersions } from './lib/data/versions';

const expectedDimension = 32;

const main = async () => {
  const invalidImages: string[] = [];
  const invalidDimensions: string[] = [];

  const latestVersion = discoverDataVersions().at(-1);
  if (!latestVersion) throw new Error('No data versions found');

  const latest = resolveDataVersion(latestVersion);
  const paths = new Set(latest.items.map((item) => item.dataTexturePath));

  for (const path of paths) {
    let image: Awaited<ReturnType<typeof loadImage>>;
    try {
      image = await loadImage(path);
    } catch {
      invalidImages.push(path);
      continue;
    }

    const { width, height } = image;
    if (width !== expectedDimension || height !== expectedDimension) {
      console.log(`${path} is ${width}x${height}`);
      invalidDimensions.push(path);
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
    console.log(JSON.stringify(invalidDimensions, null, 2));
    if (process.env.GITHUB_ACTIONS) {
      core.warning(message);
    }
  }

  if (invalidImages.length > 0 || invalidDimensions.length > 0) {
    process.exit(1);
  }
};

main();

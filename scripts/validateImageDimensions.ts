import * as core from '@actions/core';
import { readdirSync } from 'fs';
import { join } from 'path';

import { loadImage } from 'canvas';

import { versions } from '../index';
import { resolveDataVersion } from './lib/data/resolver';
import { TEXTURE_DATA_DIR } from './lib/data/versions';

const expectedDimension = 32;
// these are 32x31
const dimensionExceptions = new Set([
  'data/textures/1.12/end_crystal.png',
  'data/textures/1.13/end_crystal.png',
]);

const main = async () => {
  const invalidImages: string[] = [];
  const invalidDimensions: string[] = [];
  const paths = new Set(findPngFiles(TEXTURE_DATA_DIR));

  for (const version of versions) {
    const resolved = resolveDataVersion(version);
    for (const item of resolved.items) {
      paths.add(item.dataTexturePath);
    }
  }

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
      if (dimensionExceptions.has(path)) continue;

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

function findPngFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return findPngFiles(path);
    return entry.isFile() && entry.name.endsWith('.png') ? [path] : [];
  });
}

import fs from 'fs';
import path from 'path';

import type { BuildOutput } from 'bun';

console.time('build');

const promises: Promise<BuildOutput>[] = [];

promises.push(
  Bun.build({
    entrypoints: ['./index.ts'],
    outdir: './dist',
    minify: true,
    format: 'cjs',
    target: 'node',
    naming: { entry: 'minecraft-textures.[ext]' },
  })
);

const texturesDir = './textures';
const textureFiles = fs.readdirSync(texturesDir);

for (const file of textureFiles) {
  promises.push(
    Bun.build({
      entrypoints: [path.resolve(texturesDir, file)],
      outdir: './dist/textures',
      minify: true,
      format: 'cjs',
      target: 'node',
      naming: { entry: '[name].[ext]' },
    })
  );
}

const results = await Promise.all(promises);
const failed = results.filter((r) => !r.success);
if (failed.length > 0) {
  console.error(`Build failed for ${failed.length} files`);
  process.exit(1);
}

console.timeEnd('build');

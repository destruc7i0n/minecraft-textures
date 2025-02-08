import fs from 'fs';
import path from 'path';

console.time('build');

await Bun.build({
  entrypoints: ['./index.ts'],
  outdir: './dist',
  minify: true,
  format: 'cjs',
  target: 'node',
  naming: { entry: 'minecraft-textures.[ext]' },
});

const texturesDir = './textures';
const textureFiles = fs.readdirSync(texturesDir);

for (const file of textureFiles) {
  await Bun.build({
    entrypoints: [path.resolve(texturesDir, file)],
    outdir: './dist/textures',
    minify: true,
    format: 'cjs',
    target: 'node',
    naming: { entry: '[name].[ext]' },
  });
}

console.timeEnd('build');

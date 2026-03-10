import fs from 'fs';
import path from 'path';

console.time('build');

const texturesDir = './textures';
const textureFiles = fs.readdirSync(texturesDir);

const results = await Promise.all([
  Bun.build({
    entrypoints: ['./index.ts'],
    outdir: './dist',
    minify: true,
    format: 'cjs',
    target: 'node',
    naming: { entry: 'minecraft-textures.[ext]' },
  }),
  ...textureFiles.map((file) =>
    Bun.build({
      entrypoints: [path.resolve(texturesDir, file)],
      outdir: './dist/textures',
      minify: true,
      format: 'cjs',
      target: 'node',
      naming: { entry: '[name].[ext]' },
    }),
  ),
]);

const failed = results.filter((r) => !r.success);
if (failed.length > 0) {
  console.error(`Build failed for ${failed.length} files`);
  process.exit(1);
}

console.timeEnd('build');

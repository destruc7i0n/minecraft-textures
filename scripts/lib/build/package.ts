export async function writePackageRuntime() {
  const result = await Bun.build({
    entrypoints: ['./index.ts'],
    outdir: './dist',
    format: 'cjs',
    target: 'node',
    naming: 'minecraft-textures.js',
  });

  if (!result.success) {
    throw new Error(
      `Failed to build package runtime:\n${result.logs.join('\n')}`,
    );
  }
}

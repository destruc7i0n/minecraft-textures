import { rm } from 'fs/promises';

import { writeFile } from './files';

export async function writePackageRuntime(manifestIndex: {
  versions: string[];
  latestVersion: string;
}) {
  const entryPath = './dist/.build/minecraft-textures-entry.ts';
  await writeFile(
    entryPath,
    `import { createRoot } from '../../src/minecraft-textures';

const root = createRoot(${JSON.stringify(manifestIndex)});

export const textures = root.textures;
export const versions = root.versions;
export const latestVersion = root.latestVersion;
export default root.default;
`,
  );

  const result = await Bun.build({
    entrypoints: [entryPath],
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

  await rm('./dist/.build', { recursive: true, force: true });
}

export async function writeDeclarations(
  versions: string[],
  latestVersion: string,
) {
  const versionTuple = versions
    .map((version) => JSON.stringify(version))
    .join(', ');

  await Promise.all([
    writeFile(
      './dist/index.d.ts',
      `export declare const textures: readonly [${versionTuple}];
export declare const versions: typeof textures;
export declare const latestVersion: ${JSON.stringify(latestVersion)};
declare const hasVersion: (version: string) => boolean;
export type { TexturesType, TexturesTypeById, Item } from './lib/types';
export default hasVersion;
`,
    ),
    copyFile('./lib/types.ts', './dist/lib/types.d.ts'),
  ]);
}

async function copyFile(source: string, target: string) {
  await Bun.write(target, Bun.file(source));
}

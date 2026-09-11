import { latestVersion, versions as packageVersions } from './index';
import { buildTextures } from './scripts/lib/build/build-textures';
import { writePackageRuntime } from './scripts/lib/build/package';
import {
  writeManifestIndex,
  writeVersionOutputs,
} from './scripts/lib/build/textures';
import { resolveDataVersion } from './scripts/lib/data/resolver';
import { discoverDataVersions } from './scripts/lib/data/versions';
import { writeJson } from './scripts/lib/build/files';
import { headers } from './lib/constants';
import type { PotionTexturesType } from './lib/types';
import { join } from 'path';

console.time('build');

const packageJson = await Bun.file('./package.json').json();
const packageVersion = packageJson.version as string;
const versions = [...packageVersions];

const resolvedVersions = versions.map((version) => resolveDataVersion(version));
const potionVersions = discoverDataVersions('./data/potions');
const potions: PotionTexturesType[] = await Promise.all(
  potionVersions.map((version) =>
    Bun.file(`data/potions/${version}.json`).json(),
  ),
);
const textureCatalog = await buildTextures(resolvedVersions, {
  additionalTexturePaths: potions.flatMap((version) =>
    version.items.map((potion) => join('data/textures', potion.texture)),
  ),
});

await writeManifestIndex(versions, latestVersion, packageVersion);

for (const version of resolvedVersions) {
  await writeVersionOutputs(version, textureCatalog);
}

await writeJson('./dist/textures/manifest/potions/index.json', {
  packageVersion,
  versions: potionVersions,
});
for (const version of potions) {
  await writeJson(`./dist/textures/manifest/potions/${version.version}.json`, {
    comment: headers.comment,
    version: version.version,
    items: version.items.map((potion) => ({
      ...potion,
      texture: textureCatalog.bySourcePath.get(
        join('data/textures', potion.texture),
      )!.assetPath,
    })),
  });
}

await writePackageRuntime();

console.timeEnd('build');

import { latestVersion, versions as packageVersions } from './index';
import { buildTextures } from './scripts/lib/build/build-textures';
import { writePackageRuntime } from './scripts/lib/build/package';
import {
  writeManifestIndex,
  writeVersionOutputs,
} from './scripts/lib/build/textures';
import { resolveDataVersion } from './scripts/lib/data/resolver';

console.time('build');

const packageJson = await Bun.file('./package.json').json();
const packageVersion = packageJson.version as string;
const versions = [...packageVersions];

const resolvedVersions = versions.map((version) => resolveDataVersion(version));
const textureCatalog = await buildTextures(resolvedVersions);

await writeManifestIndex(versions, latestVersion, packageVersion);

for (const version of resolvedVersions) {
  await writeVersionOutputs(version, textureCatalog);
}

await writePackageRuntime();

console.timeEnd('build');

import { latestVersion, versions as packageVersions } from './index';
import { writePackageRuntime } from './scripts/lib/build/package';
import {
  writeManifestIndex,
  writeResolvedAssets,
  writeVersionOutputs,
} from './scripts/lib/build/textures';
import { resolveDataVersion } from './scripts/lib/data/resolver';

console.time('build');

const packageJson = await Bun.file('./package.json').json();
const packageVersion = packageJson.version as string;
const versions = [...packageVersions];

const resolvedVersions = versions.map((version) => resolveDataVersion(version));

await Promise.all([
  writeResolvedAssets(resolvedVersions),
  writeManifestIndex(versions, latestVersion, packageVersion),
  ...resolvedVersions.map((version) => writeVersionOutputs(version)),
]);

await writePackageRuntime();

console.timeEnd('build');

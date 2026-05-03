import {
  writeDeclarations,
  writePackageRuntime,
} from './scripts/lib/build/package';
import {
  writeManifestIndex,
  writeResolvedAssets,
  writeVersionOutputs,
} from './scripts/lib/build/textures';
import { resolveDataVersion } from './scripts/lib/data/resolver';
import { discoverDataVersions } from './scripts/lib/data/versions';

console.time('build');

const packageJson = await Bun.file('./package.json').json();
const packageVersion = packageJson.version as string;
const versions = discoverDataVersions();
const latestVersion = versions.at(-1);

if (!latestVersion) {
  throw new Error('No data versions found');
}

const resolvedVersions = versions.map((version) => resolveDataVersion(version));
const manifestIndex = { packageVersion, latestVersion, versions };

await Promise.all([
  writeDeclarations(versions, latestVersion),
  writeResolvedAssets(resolvedVersions),
  writeManifestIndex(versions, latestVersion, packageVersion),
  ...resolvedVersions.map((version) => writeVersionOutputs(version)),
]);

await writePackageRuntime(manifestIndex);

console.timeEnd('build');

// bumps the version across package.json and README.md to match index.ts
import { latestVersion } from '../index.ts';

const toSemver = (v: string) => (v.split('.').length < 3 ? `${v}.0` : v);

const packageJson = await Bun.file('./package.json').json();
const oldVersion = packageJson.version as string;
const semverVersion = toSemver(latestVersion);

if (oldVersion === semverVersion) {
  console.log(`Already at ${semverVersion}, nothing to do.`);
  process.exit(0);
}

// update package.json
packageJson.version = semverVersion;
await Bun.write('./package.json', JSON.stringify(packageJson, null, 2) + '\n');
console.log(`package.json: ${oldVersion} -> ${semverVersion}`);

// update README.md
const readme = await Bun.file('./README.md').text();
const updatedReadme = readme.replace(
  /Textures from ([\d.]+) to ([\d.]+) currently available\./,
  `Textures from $1 to ${latestVersion} currently available.`,
);
if (readme === updatedReadme) {
  console.warn('README.md: no change (pattern not found)');
} else {
  await Bun.write('./README.md', updatedReadme);
  console.log(`README.md: updated latest to ${latestVersion}`);
}

console.log(`\ngit tag v${semverVersion} && git push origin v${semverVersion}`);

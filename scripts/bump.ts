import { latestVersion } from '../index';

const toSemver = (v: string) => (v.split('.').length < 3 ? `${v}.0` : v);
const packageVersion = process.argv[2] ?? toSemver(latestVersion);

const packageJson = await Bun.file('./package.json').json();
const oldVersion = packageJson.version as string;

if (oldVersion === packageVersion) {
  console.log(`package.json: already at ${packageVersion}`);
} else {
  packageJson.version = packageVersion;
  await Bun.write(
    './package.json',
    `${JSON.stringify(packageJson, null, 2)}\n`,
  );
  console.log(`package.json: ${oldVersion} -> ${packageVersion}`);
}

const readme = await Bun.file('./README.md').text();
const readmeReplacements = [
  {
    name: 'version range',
    pattern:
      /Minecraft item texture metadata and PNG assets for versions ([\d.]+) through ([\d.]+)\./,
    replacement: `Minecraft item texture metadata and PNG assets for versions $1 through ${latestVersion}.`,
  },
  {
    name: 'manifest import',
    pattern: /minecraft-textures\/manifest\/[\d.]+\.json/g,
    replacement: `minecraft-textures/manifest/${latestVersion}.json`,
  },
  {
    name: 'texture path example',
    pattern: /`[\d.]+\/diamond_sword\.png`/,
    replacement: `\`${latestVersion}/diamond_sword.png\``,
  },
  {
    name: 'latestVersion example',
    pattern: /console\.log\(latestVersion\); \/\/ '[\d.]+'/,
    replacement: `console.log(latestVersion); // '${latestVersion}'`,
  },
];

const missingReadmePatterns = readmeReplacements
  .filter(({ pattern }) => !readme.match(pattern))
  .map(({ name }) => name);
const updatedReadme = readmeReplacements.reduce(
  (acc, { pattern, replacement }) => acc.replace(pattern, replacement),
  readme,
);
for (const name of missingReadmePatterns) {
  console.warn(`README.md: ${name} pattern not found`);
}
if (readme === updatedReadme) {
  console.log(`README.md: already at ${latestVersion}`);
} else {
  await Bun.write('./README.md', updatedReadme);
  console.log(`README.md: updated latest to ${latestVersion}`);
}

console.log(
  `\ngit tag v${packageVersion} && git push origin v${packageVersion}`,
);

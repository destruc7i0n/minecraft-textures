# Minecraft Textures

[![npm version][npm-version-src]][npm-version-href]
[![GitHub Actions][github-actions-src]][github-actions-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]

This is a library containing all the textures I use for my generators.

Textures from 1.12 to 26.1 currently available.

`npm install minecraft-textures`

## Usage

Check if a version is available:

```js
import hasVersion, { versions, latestVersion } from 'minecraft-textures';

const version = '1.21';
if (hasVersion(version)) {
  const { default: textures } = await import(
    `minecraft-textures/dist/textures/json/${version}.json`,
    { with: { type: 'json' } }
  );
}

console.log(versions); // all available versions
console.log(latestVersion); // '26.1'
```

The textures are base64-encoded PNG images:

```js
const { default: textures } = await import(
  'minecraft-textures/dist/textures/json/1.21.json',
  { with: { type: 'json' } }
);

// textures.items is an array of { readable, id, texture }
const item = textures.items.find(
  (item) => item.id === 'minecraft:diamond_sword',
);
console.log(item.readable); // "Diamond Sword"
console.log(item.id); // "minecraft:diamond_sword"
console.log(item.texture); // "data:image/png;base64,..."
```

For ID-based lookups, use the `.id.json` files:

```js
const { default: textures } = await import(
  'minecraft-textures/dist/textures/json/1.21.id.json',
  { with: { type: 'json' } }
);

const sword = textures.items['minecraft:diamond_sword'];
// { readable: "Diamond Sword", texture: "data:image/png;base64,..." }
```

The maintained source images are PNG files. For browser apps that want stable
PNG asset paths instead of base64 data URLs, use the generated manifests:

```js
import manifestIndex from 'minecraft-textures/manifest/index.json';
import manifest from 'minecraft-textures/manifest/26.1.json';

const textureBaseUrl = `/minecraft-textures/${manifestIndex.packageVersion}`;

const items = manifest.items.map((item) => ({
  ...item,
  texture: `${textureBaseUrl}/${item.texture}`,
}));
```

Serve or copy `dist/textures/assets` at `textureBaseUrl`; each manifest texture
path is relative to that directory. The same PNG files are also exported for
bundlers from `minecraft-textures/assets/*`.

## Update Notes

### 26.1.0

- Maintained texture images now live as PNG files in `data/textures`.
- Version and item metadata now lives in `data/versions`.
- Legacy base64 JSON and per-version JS files are still generated in `dist` for compatibility.
- New manifest JSON files and PNG assets are generated for consumers that want URL-based image loading.
- `.id.json` files are now generated from the legacy array JSON, correcting an old by-id output bug.

### 1.20

- The ordering of the JSON files have been updated to match the order of the items in the Search Items creative tab.

### 1.17

- The file names were updated to be the actual version (i.e. `1.17.ts` rather than `117.ts`)

### 1.16

- For anyone using the .json files, you can use a URL like:
  - https://unpkg.com/minecraft-textures/dist/textures/json/1.16.json

## License

Please credit `destruc7i0n (https://thedestruc7i0n.ca)` if you use this. Its not required, but is appreciated.

The Minecraft item icons are owned by Mojang Studios.

This project is not affiliated with Mojang Studios.

[npm-version-src]: https://img.shields.io/npm/v/minecraft-textures?style=flat-square
[npm-version-href]: https://npmjs.com/package/minecraft-textures
[npm-downloads-src]: https://img.shields.io/npm/dm/minecraft-textures?style=flat-square
[npm-downloads-href]: https://npmjs.com/package/minecraft-textures
[github-actions-src]: https://img.shields.io/github/actions/workflow/status/destruc7i0n/minecraft-textures/build.yml?style=flat-square&branch=master
[github-actions-href]: https://github.com/destruc7i0n/minecraft-textures/actions/workflows/build.yml

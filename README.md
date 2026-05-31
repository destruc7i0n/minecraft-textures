# Minecraft Textures

[![npm version][npm-version-src]][npm-version-href]
[![GitHub Actions][github-actions-src]][github-actions-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]

Minecraft item texture metadata and PNG assets for versions 1.12 through 26.1.

`npm install minecraft-textures`

## Usage

Use the generated manifests for item metadata and relative PNG asset paths:

```js
import manifestIndex from 'minecraft-textures/manifest/index.json';
import manifest from 'minecraft-textures/manifest/26.1.json';

const assetBaseUrl = `/minecraft-textures/${manifestIndex.packageVersion}`;

const items = manifest.items.map((item) => ({
  ...item,
  textureUrl: `${assetBaseUrl}/${item.texture}`,
}));
```

`manifest.items` is an array of `{ id, readable, texture }`. Use `texture` as
a path relative to `dist/textures/assets`.

Serve or copy `dist/textures/assets` at `assetBaseUrl`; each manifest texture
path is relative to that directory. The same PNG files are also exported for
bundlers from `minecraft-textures/assets/*`.

To check available versions:

```js
import hasVersion, { versions, latestVersion } from 'minecraft-textures';

const version = '1.21';
if (hasVersion(version)) {
  const { default: manifest } = await import(
    `minecraft-textures/manifest/${version}.json`,
    { with: { type: 'json' } }
  );
  console.log(manifest.items.length);
}

console.log(versions); // all available versions
console.log(latestVersion); // '26.1'
```

## Deprecated Base64 Compatibility

The legacy base64 JSON files are still generated for compatibility, but they
are deprecated. New consumers should use `minecraft-textures/manifest/*.json`
plus PNG assets from `dist/textures/assets`.

These imports will be removed in a future major release.

For legacy array JSON:

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

For legacy ID-based lookups:

```js
const { default: textures } = await import(
  'minecraft-textures/dist/textures/json/1.21.id.json',
  { with: { type: 'json' } }
);

const sword = textures.items['minecraft:diamond_sword'];
// { readable: "Diamond Sword", texture: "data:image/png;base64,..." }
```

For legacy per-version JS:

```js
const textures = require('minecraft-textures/dist/textures/1.21.js').default;
```

## Update Notes

### 26.2.0-beta.1

- Texture images now live as PNG files in `data/textures`.
- Version and item metadata now lives in `data/versions`.
- Legacy base64 JSON and per-version JS files are deprecated and will be removed in a future release. Use manifests and PNG assets for new code.

### 1.20

- The ordering of the JSON files have been updated to match the order of the items in the Search Items creative tab.

### 1.17

- The file names were updated to be the actual version (i.e. `1.17.ts` rather than `117.ts`)

### 1.16

- For anyone using the .json files, you can use a URL like:
  - https://unpkg.com/minecraft-textures/dist/textures/json/1.16.json

## License

Please credit `destruc7i0n (https://thedestruc7i0n.ca)` if you use this. It's not required, but is appreciated.

The Minecraft item icons are owned by Mojang Studios.

This project is not affiliated with Mojang Studios.

[npm-version-src]: https://img.shields.io/npm/v/minecraft-textures?style=flat-square
[npm-version-href]: https://npmjs.com/package/minecraft-textures
[npm-downloads-src]: https://img.shields.io/npm/dm/minecraft-textures?style=flat-square
[npm-downloads-href]: https://npmjs.com/package/minecraft-textures
[github-actions-src]: https://img.shields.io/github/actions/workflow/status/destruc7i0n/minecraft-textures/build.yml?style=flat-square&branch=master
[github-actions-href]: https://github.com/destruc7i0n/minecraft-textures/actions/workflows/build.yml

import { describe, expect, test } from 'bun:test';
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'fs';
import { createHash } from 'crypto';
import { tmpdir } from 'os';
import { join } from 'path';

import { loadPotionVersion } from '../scripts/lib/data/potions';

describe('potion version isolation', () => {
  test('new textures and potions do not change older catalogs', () => {
    const root = mkdtempSync(join(tmpdir(), 'potion-versions-'));
    const options = {
      versionDir: join(root, 'versions'),
      textureDir: join(root, 'textures'),
    };
    try {
      mkdirSync(options.versionDir);
      for (const version of ['26.2', '26.3']) {
        mkdirSync(join(options.textureDir, version, 'potions'), {
          recursive: true,
        });
        writeFileSync(
          join(options.textureDir, version, 'potions/healing.png'),
          version,
        );
      }
      const oldItem = {
        id: 'minecraft:potion',
        potion: 'minecraft:healing',
        readable: 'Healing',
        texture: '26.2/potions/healing.png',
      };
      const write = (version: string, items: (typeof oldItem)[]) =>
        writeFileSync(
          join(options.versionDir, `${version}.json`),
          JSON.stringify({ version, items }),
        );
      write('26.2', [oldItem]);
      const original = loadPotionVersion('26.2', options);
      write('26.3', [oldItem, { ...oldItem, potion: 'example:new_potion' }]);
      expect(loadPotionVersion('26.3', options).items).toEqual([
        oldItem,
        { ...oldItem, potion: 'example:new_potion' },
      ]);
      write('26.3', [{ ...oldItem, texture: '26.3/potions/healing.png' }]);
      expect(loadPotionVersion('26.3', options).items[0].texture).toBe(
        '26.3/potions/healing.png',
      );
      expect(loadPotionVersion('26.2', options)).toEqual(original);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  test('rejects unversioned, missing, future, and mismatched sources', () => {
    const root = mkdtempSync(join(tmpdir(), 'potion-invalid-'));
    const options = { versionDir: root, textureDir: join(root, 'textures') };
    try {
      for (const folder of ['potions', '26.3/potions']) {
        mkdirSync(join(options.textureDir, folder), { recursive: true });
        writeFileSync(
          join(options.textureDir, folder, 'healing.png'),
          'fixture',
        );
      }
      const write = (version: string, texture: string) =>
        writeFileSync(
          join(root, '26.2.json'),
          JSON.stringify({
            version,
            items: [{ id: 'minecraft:potion', readable: 'Healing', texture }],
          }),
        );
      write('26.2', 'potions/healing.png');
      expect(() => loadPotionVersion('26.2', options)).toThrow(
        /version folder/,
      );
      write('26.2', '26.2/potions/missing.png');
      expect(() => loadPotionVersion('26.2', options)).toThrow(
        /Missing texture/,
      );
      write('26.2', '26.3/potions/healing.png');
      expect(() => loadPotionVersion('26.2', options)).toThrow(
        /future texture/,
      );
      write('26.3', '26.3/potions/healing.png');
      expect(() => loadPotionVersion('26.2', options)).toThrow(
        /Version mismatch/,
      );
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});

// Pin each released catalog and its image contents. Add a baseline for new
// catalog versions; changing a later version must not change an older digest.
test('26.2 potion metadata and image contents remain unchanged', () => {
  const catalog = loadPotionVersion('26.2');
  const hash = createHash('sha256').update(JSON.stringify(catalog));
  for (const item of catalog.items) {
    hash.update(
      new Uint8Array(readFileSync(join('data/textures', item.texture))),
    );
  }
  expect(hash.digest('hex')).toBe(
    'a9a1693be21040200242ddd130efec2b5aab581194e713573a424b5cd5123811',
  );
});

test('rejects duplicate identities for either edition', () => {
  const root = mkdtempSync(join(tmpdir(), 'potion-identities-'));
  try {
    mkdirSync(join(root, '26.2'));
    writeFileSync(join(root, '26.2/healing.png'), 'fixture');
    const first = {
      id: 'minecraft:potion',
      readable: 'Healing',
      texture: '26.2/healing.png',
      potion: 'minecraft:healing',
      bedrockPotion: 'minecraft:healing',
    };
    const options = { versionDir: root, textureDir: root };
    for (const field of ['potion', 'bedrockPotion'] as const) {
      const second = {
        ...first,
        potion: 'example:other',
        bedrockPotion: 'example:other',
        [field]: first[field],
      };
      writeFileSync(
        join(root, '26.2.json'),
        JSON.stringify({ version: '26.2', items: [first, second] }),
      );
      expect(() => loadPotionVersion('26.2', options)).toThrow(
        `Duplicate ${field} identity`,
      );
    }
    writeFileSync(
      join(root, '26.2.json'),
      JSON.stringify({
        version: '26.2',
        items: [{ ...first, potion: undefined, bedrockPotion: undefined }],
      }),
    );
    expect(() => loadPotionVersion('26.2', options)).toThrow(/potion identity/);
    expect(() => loadPotionVersion('latest', options)).toThrow(
      /Invalid potion version/,
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

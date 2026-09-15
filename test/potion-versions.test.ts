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
test.each([
  ['1.12', '9bc0cfce9a61d8db8e9fc7da7afa04cb4e141c3705242a39d56b4d676d484e75'],
  ['1.13', 'fbf6212b5ee236839a03a31ead7222e9ce1ca4a2a835577b69caf26c5eb95f8d'],
  ['1.14', 'c76b71aa7515c8855591755a9207387da2ed80ca6b93443b2b96edb78a0ddeda'],
  [
    '1.19.4',
    '8371457d571b992128043f139e6716dbe2abeb2b8381684fc8c0af4b8262b58a',
  ],
  ['1.20', 'fa754b5e4d06323b3dea859d6a3a9071ca8593c8df0ecf3eb8df277aa3b52433'],
  ['1.21', 'ab1fd2f06d12fd61be5a0b17fbe08d50272729db4dfb365b5d81918186ccbc8c'],
  ['26.2', '6fea41ebf6811aba103cba9bd877b4d46a8cb5b96cb0b01245db053c744c61ab'],
])(
  '%s potion metadata and image contents remain unchanged',
  (version, digest) => {
    const catalog = loadPotionVersion(version);
    const hash = createHash('sha256').update(JSON.stringify(catalog));
    for (const item of catalog.items) {
      hash.update(
        new Uint8Array(readFileSync(join('data/textures', item.texture))),
      );
    }
    expect(hash.digest('hex')).toBe(digest);
  },
);

test('historical catalogs track artwork, colors, and potion availability', () => {
  const potion = (version: string, id: string) =>
    loadPotionVersion(version).items.find(
      (item) =>
        item.id === 'minecraft:potion' && item.potion === `minecraft:${id}`,
    );
  expect(potion('1.12', 'slow_falling')).toBeUndefined();
  expect(potion('1.13', 'slow_falling')).toBeDefined();
  expect(potion('1.20', 'wind_charged')).toBeUndefined();
  expect(potion('1.21', 'wind_charged')).toBeDefined();
  expect(potion('1.12', 'healing')?.texture).toBe(
    '1.12/potions/potion_healing.png',
  );
  expect(potion('1.14', 'healing')?.texture).toBe(
    '1.14/potions/potion_healing.png',
  );
  expect(potion('1.19.4', 'night_vision')?.texture).toBe(
    '1.19.4/potions/potion_night_vision.png',
  );
  expect(potion('1.20', 'slow_falling')?.texture).toBe(
    '1.20/potions/potion_slow_falling.png',
  );
  expect(potion('26.2', 'healing')?.texture).toBe(
    potion('1.14', 'healing')?.texture,
  );
  expect(potion('1.14', 'strength')?.tooltip).toEqual(['Strength (3:00)']);
  expect(potion('1.19.4', 'strength')?.tooltip).toEqual(['Strength (03:00)']);
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

test('potion overlays share add, update, remove, and order behavior without losing metadata', () => {
  const root = mkdtempSync(join(tmpdir(), 'potion-overlays-'));
  try {
    for (const version of ['1.0', '1.1']) {
      mkdirSync(join(root, version));
      writeFileSync(join(root, version, 'potion.png'), version);
    }
    const healing = {
      id: 'minecraft:potion',
      potion: 'minecraft:healing',
      bedrockPotion: 'minecraft:healing',
      readable: 'Healing',
      texture: '1.0/potion.png',
      tooltip: ['Instant Health'],
    };
    const speed = {
      ...healing,
      potion: 'minecraft:swiftness',
      bedrockPotion: 'minecraft:swiftness',
    };
    const wither = {
      ...healing,
      potion: undefined,
      bedrockPotion: 'minecraft:wither',
    };
    const strength = {
      ...healing,
      potion: 'minecraft:strength',
      bedrockPotion: 'minecraft:strength',
    };
    const write = (version: string, data: object) =>
      writeFileSync(
        join(root, `${version}.json`),
        JSON.stringify({ version, ...data }),
      );
    write('1.0', { items: [healing, speed, wither] });
    const key = (potion: string) => `minecraft:potion|minecraft:${potion}`;
    const changes = {
      readable: 'Updated Healing',
      texture: '1.1/potion.png',
      tooltip: ['Updated effect'],
    };
    write('1.1', {
      extends: '1.0',
      add: [strength],
      update: { [key('healing')]: changes },
      remove: [key('wither')],
      order: [key('strength'), key('healing')],
    });
    const options = { versionDir: root, textureDir: root };
    expect(loadPotionVersion('1.1', options).items).toEqual([
      strength,
      { ...healing, ...changes },
      speed,
    ]);
    expect(loadPotionVersion('1.0', options).items[0]).toEqual(healing);
    write('1.1', {
      extends: '1.0',
      update: { [key('healing')]: { potion: 'minecraft:swiftness' } },
    });
    expect(() => loadPotionVersion('1.1', options)).toThrow(/duplicate id/);
    write('1.1', { extends: '1.0', add: [healing] });
    expect(() => loadPotionVersion('1.1', options)).toThrow(/inherited id/);
    write('1.1', { extends: '1.0' });
    write('1.0', { items: [{ ...healing, texture: '1.1/potion.png' }] });
    expect(() => loadPotionVersion('1.1', options)).toThrow(/future texture/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

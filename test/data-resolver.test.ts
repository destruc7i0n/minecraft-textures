import { describe, expect, test } from 'bun:test';
import { mkdirSync, mkdtempSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { tmpdir } from 'os';

import {
  createLegacyJson,
  createLegacyJsonById,
} from '../scripts/lib/data/legacy';
import {
  defaultTextureName,
  resolveDataVersion,
} from '../scripts/lib/data/resolver';
import { discoverDataVersions } from '../scripts/lib/data/versions';

const png = () => Bun.file('data/textures/1.12/stone.png').arrayBuffer();

const fixture = async () => {
  const root = mkdtempSync(join(tmpdir(), 'minecraft-textures-'));
  const versionDir = join(root, 'versions');
  const textureDir = join(root, 'textures');
  mkdirSync(join(textureDir, '1.0'), { recursive: true });
  mkdirSync(join(textureDir, '1.1'), { recursive: true });
  const bytes = new Uint8Array(await png());
  writeFileSync(join(textureDir, '1.0', 'stone.png'), bytes);
  writeFileSync(join(textureDir, '1.1', 'stone.png'), bytes);
  return { root, versionDir, textureDir, bytes };
};

const writeJson = (path: string, value: unknown) => {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
};

const createTestLegacyJson = (version: ReturnType<typeof resolveDataVersion>) =>
  createLegacyJson(version, (item) => item.dataTexturePath);

describe('data resolver', () => {
  test('discovers data versions in Minecraft version order', () => {
    const versions = discoverDataVersions();
    expect(versions.slice(0, 3)).toEqual(['1.12', '1.13', '1.14']);
    expect(versions.at(-1)).toBe('26.1');
  });

  test('preserves legacy 1.12 duplicate ids for array compatibility', () => {
    const wheatItems = resolveDataVersion('1.12').items.filter(
      (item) => item.id === 'minecraft:wheat',
    );

    expect(wheatItems.map((item) => item.readable)).toEqual([
      'Wheat Crops',
      'Wheat',
    ]);
  });

  test('legacy by-id JSON is derived from the legacy array JSON', () => {
    const resolved = resolveDataVersion('1.13');
    const legacy = createTestLegacyJson(resolved);
    const byId = createLegacyJsonById(legacy);

    expect(byId).toEqual(createLegacyJsonById(legacy));
  });

  test('legacy by-id JSON uses the last duplicate id from the array JSON', () => {
    const resolved = resolveDataVersion('1.12');
    const legacy = createTestLegacyJson(resolved);
    const byId = createLegacyJsonById(legacy);
    const wheatItems = legacy.items.filter(
      (item) => item.id === 'minecraft:wheat',
    );

    expect(wheatItems.map((item) => item.readable)).toEqual([
      'Wheat Crops',
      'Wheat',
    ]);
    const lastWheatItem = wheatItems[wheatItems.length - 1]!;
    expect(byId.items['minecraft:wheat']).toEqual({
      readable: lastWheatItem.readable,
      texture: lastWheatItem.texture,
    });
  });

  test('resolves base and overlay versions with child texture overrides', async () => {
    const { versionDir, textureDir } = await fixture();
    writeJson(join(versionDir, '1.0.json'), {
      version: '1.0',
      items: [{ id: 'minecraft:stone', readable: 'Stone' }],
    });
    writeJson(join(versionDir, '1.1.json'), {
      version: '1.1',
      extends: '1.0',
      update: { 'minecraft:stone': { readable: 'Better Stone' } },
    });

    const resolved = resolveDataVersion('1.1', { versionDir, textureDir });
    expect(resolved.items[0]).toMatchObject({
      id: 'minecraft:stone',
      readable: 'Better Stone',
      texture: '1.1/stone.png',
    });
  });

  test('fails when base versions include overlay fields', async () => {
    const { versionDir, textureDir } = await fixture();
    writeJson(join(versionDir, '1.0.json'), {
      version: '1.0',
      items: [{ id: 'minecraft:stone', readable: 'Stone' }],
      add: [{ id: 'minecraft:granite', readable: 'Granite' }],
    });

    expect(() => resolveDataVersion('1.0', { versionDir, textureDir })).toThrow(
      /without extends/,
    );
  });

  test('fails on extends cycles and invalid update/remove targets', async () => {
    const { versionDir, textureDir } = await fixture();
    writeJson(join(versionDir, '1.0.json'), {
      version: '1.0',
      extends: '1.1',
    });
    writeJson(join(versionDir, '1.1.json'), {
      version: '1.1',
      extends: '1.0',
    });
    expect(() => resolveDataVersion('1.0', { versionDir, textureDir })).toThrow(
      /cycle/,
    );

    writeJson(join(versionDir, '2.0.json'), {
      version: '2.0',
      items: [{ id: 'minecraft:stone', readable: 'Stone' }],
    });
    mkdirSync(join(textureDir, '2.0'), { recursive: true });
    writeFileSync(
      join(textureDir, '2.0', 'stone.png'),
      new Uint8Array(await png()),
    );
    writeJson(join(versionDir, '2.1.json'), {
      version: '2.1',
      extends: '2.0',
      update: { 'minecraft:missing': { readable: 'Missing' } },
    });
    expect(() => resolveDataVersion('2.1', { versionDir, textureDir })).toThrow(
      /missing/,
    );
  });

  test('fails when add duplicates inherited ids or update creates duplicate ids', async () => {
    const { versionDir, textureDir } = await fixture();
    writeJson(join(versionDir, '1.0.json'), {
      version: '1.0',
      items: [
        { id: 'minecraft:stone', readable: 'Stone' },
        { id: 'minecraft:granite', readable: 'Granite' },
      ],
    });
    writeFileSync(
      join(textureDir, '1.0', 'granite.png'),
      new Uint8Array(await png()),
    );

    writeJson(join(versionDir, '1.1.json'), {
      version: '1.1',
      extends: '1.0',
      add: [{ id: 'minecraft:stone', readable: 'Stone' }],
    });
    expect(() => resolveDataVersion('1.1', { versionDir, textureDir })).toThrow(
      /inherited/,
    );

    writeJson(join(versionDir, '1.2.json'), {
      version: '1.2',
      extends: '1.0',
      update: { 'minecraft:stone': { id: 'minecraft:granite' } },
    });
    expect(() => resolveDataVersion('1.2', { versionDir, textureDir })).toThrow(
      /duplicate/,
    );

    writeJson(join(versionDir, '1.3.json'), {
      version: '1.3',
      extends: '1.0',
      update: { 'minecraft:stone': { id: 'minecraft:diorite' } },
      add: [
        {
          id: 'minecraft:diorite',
          readable: 'Diorite',
          texture: 'diorite.png',
        },
      ],
    });
    expect(() => resolveDataVersion('1.3', { versionDir, textureDir })).toThrow(
      /duplicate/,
    );
  });

  test('defaultTextureName is stable', () => {
    expect(defaultTextureName('minecraft:stone:1')).toBe('stone_1.png');
  });

  test('resolved order follows the data version order field', () => {
    expect(resolveDataVersion('1.14').items[0].id).toBe('minecraft:oak_log');
  });
});

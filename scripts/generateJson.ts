import {
  writeFileSync as write,
  existsSync as exists,
  mkdirSync as mkdir,
} from 'fs';
import { resolve } from 'path';

import * as core from '@actions/core';

import { versions } from '../';
import type { TexturesType, TexturesTypeById, Item } from '../lib/types';
import { compareMinecraftVersions } from './lib/util';

const ITEM_GROUPS_DUMPER_URL =
  'https://raw.githubusercontent.com/destruc7i0n/item-groups-dumper/refs/heads/main/generated/items.json';

// convert the js to json for npm
const main = async () => {
  if (!exists('./dist/textures/json'))
    mkdir('./dist/textures/json', { recursive: true });

  // write(`./dist/textures/json/versions.json`, JSON.stringify({
  //   versions,
  //   latest: latestVersion,
  // }, null, 2))

  console.log('Fetching items ordering...');
  const SEARCH_ITEMS_ORDERING: string[] = await fetch(
    ITEM_GROUPS_DUMPER_URL,
  ).then((r) => r.json());

  const countByVersion: Record<string, number> = {};

  await Promise.all(
    versions.map(async (version) => {
      console.log(`Generating json for ${version}`);

      const textures: TexturesType = (
        await import(resolve(`./textures/${version}.ts`))
      ).default;

      // convert to object by id
      const texturesById: Record<string, Item> = textures.items.reduce(
        (acc, el) => ({
          ...acc,
          [el.id]: el,
        }),
        {},
      );

      // sort by search order for 1.14 and newer versions
      if (compareMinecraftVersions(version, '1.14') >= 0) {
        // add the items in search order
        const searchItemsOrder: TexturesType['items'] = [];
        for (const id of SEARCH_ITEMS_ORDERING) {
          if (texturesById[id]) {
            searchItemsOrder.push(texturesById[id]);
            delete texturesById[id];
          } else {
            // console.warn(`Missing item in search order: ${id}`);
          }
        }
        const leftover = Object.keys(texturesById);
        console.log(`${leftover.length} Leftover items:`, leftover);
        // add the rest
        for (const id of leftover) {
          searchItemsOrder.push(texturesById[id]);
          delete texturesById[id];
        }
        textures.items = searchItemsOrder;
      }

      countByVersion[version] = textures.items.length;

      // sequential array
      write(
        `./dist/textures/json/${version}.json`,
        JSON.stringify(textures, null, 2),
      );

      // by id in object
      const byId: TexturesTypeById = {
        comment: textures.comment,
        items: textures.items.reduce(
          (acc, el) => ({
            ...acc,
            [el.id]: { readable: el.readable, texture: el.texture },
          }),
          {},
        ),
      };
      write(
        `./dist/textures/json/${version}.id.json`,
        JSON.stringify(byId, null, 2),
      );
    }),
  );

  if (process.env.GITHUB_ACTIONS) {
    await core.summary
      .addHeading('Generated JSON', 1)
      .addTable([
        [
          { data: 'Version', header: true },
          { data: 'Count', header: true },
        ],
        ...Object.entries(countByVersion).map(([version, count]) => [
          { data: version },
          { data: `${count} items` },
        ]),
      ])
      .write();
  }
};

main();

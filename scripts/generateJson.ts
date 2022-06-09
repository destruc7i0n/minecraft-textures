import {
  writeFileSync as write,
  existsSync as exists,
  mkdirSync as mkdir,
} from 'fs';
import { resolve } from 'path';
import { versions } from '../';
import { TexturesType, TexturesTypeById } from '../lib/types';

// convert the js to json for npm
const main = async () => {
  if (!exists('./dist/textures/json'))
    mkdir('./dist/textures/json', { recursive: true });

  // write(`./dist/textures/json/versions.json`, JSON.stringify({
  //   versions,
  //   latest: latestVersion,
  // }, null, 2))

  for (let version of versions) {
    const textures: TexturesType = (
      await import(resolve(`./textures/${version}.ts`))
    ).default;

    // sequential array
    write(
      `./dist/textures/json/${version}.json`,
      JSON.stringify(textures, null, 2)
    );

    // by id in object
    const byId: TexturesTypeById = {
      comment: textures.comment,
      items: textures.items.reduce(
        (acc, el) => ({
          ...acc,
          [el.id]: { readable: el.readable, texture: el.texture },
        }),
        {}
      ),
    };
    write(
      `./dist/textures/json/${version}.id.json`,
      JSON.stringify(byId, null, 2)
    );
  }
};

main();

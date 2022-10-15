import {
  writeFileSync as write,
  existsSync as exists,
  mkdirSync as mkdir,
} from 'fs';

import type { TexturesType } from '../lib/types';

import { versions } from '../index';
import { headers } from '../lib/constants';

const oneLine = (string: string) =>
  string
    .split('\n')
    .map((s) => s.trim())
    .join('');

// generates a debug sheet of the textures in an html file
const main = async () => {
  const file = process.argv[2] ?? 'all';

  if (!exists('./debug')) mkdir('./debug');

  for (const version of versions) {
    if (file !== 'all' && version !== file) continue;

    const contents: TexturesType = (await import(`../textures/${version}`))
      .default;

    const palette = contents.items.reduce(
      (acc, item) =>
        acc +
        `<img src="${item.texture}" alt="${item.readable}" title="${item.readable} (${item.id})" />`,
      ''
    );

    const table = `
      <table>
        <tr>
          <th>Name</th>
          <th>ID</th>
          <th>Image</th>
        </tr>
        ${contents.items
          .map(
            (item) => `
          <tr>
            <td>${item.readable}</td>
            <td>${item.id}</td>
            <td><img src="${item.texture}" alt="${item.readable}" title="${item.readable} (${item.id})" /></td>
          </tr>
        `
          )
          .join('')}
      </table>
    `;

    const html = oneLine(`
      <html>
        <head>
          <title>Debug</title>
          <style>
            table, th, td {
              border: 1px solid black;
              border-collapse: collapse;
            }
          </style>
        </head>
        <body>
          <span>
            Version: ${version}, Items Count: ${contents.items.length}
          </span>
          <br />
          <span>
            ${headers.comment}
          </span>
          <br /><br />
          <details>
            <summary>Palette</summary>
            <div style="max-width: ${32 * 16}px;display:flex;flex-wrap:wrap;">
              ${palette}
            </div>
          </details>
          <details>
            <summary>Table</summary>
            ${table}
          </details>
          </div>
        </body>
      </html>
    `);

    write(`./debug/debug-${version}.html`, html);
  }
};

main();

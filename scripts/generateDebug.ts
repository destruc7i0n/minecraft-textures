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
      '',
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
        `,
          )
          .join('')}
      </table>
    `;

    const html = oneLine(`
      <html>
        <head>
          <title>Debug - ${version}</title>
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { font-family: monospace; background: #1a1a1a; color: #eee; padding: 24px; }
            h1 { font-size: 1.1rem; color: #aaa; margin-bottom: 4px; }
            p { font-size: 0.8rem; color: #666; margin-bottom: 24px; }
            details { margin-bottom: 16px; }
            summary { cursor: pointer; font-size: 0.85rem; color: #aaa; padding: 6px 0; user-select: none; }
            summary:hover { color: #eee; }
            .palette { display: flex; flex-wrap: wrap; gap: 2px; max-width: ${32 * 16}px; padding-top: 12px; }
            .palette img { image-rendering: pixelated; width: 32px; height: 32px; }
            table { border-collapse: collapse; margin-top: 12px; font-size: 0.75rem; }
            th { background: #2a2a2a; color: #aaa; font-weight: normal; padding: 6px 12px; border: 1px solid #333; text-align: left; }
            td { padding: 6px 12px; border: 1px solid #2a2a2a; color: #ccc; vertical-align: middle; }
            tr:hover td { background: #222; }
            td img { image-rendering: pixelated; width: 32px; height: 32px; display: block; }
          </style>
        </head>
        <body>
          <h1>Debug - ${version}</h1>
          <p>${contents.items.length} items - ${headers.comment}</p>
          <details open>
            <summary>Palette</summary>
            <div class="palette">
              ${palette}
            </div>
          </details>
          <details>
            <summary>Table</summary>
            ${table}
          </details>
        </body>
      </html>
    `);

    write(`./debug/debug-${version}.html`, html);
  }
};

main();

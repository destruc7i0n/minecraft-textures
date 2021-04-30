import { writeFileSync as write, existsSync as exists, mkdirSync as mkdir } from 'fs'

import type { TexturesType } from '../lib/types'

import { versions } from '../index'

const oneLine = (string: string) => string.split('\n').map(s => s.trim()).join('')

// generates a debug sheet of the textures in an html file
const main = async () => {
  const file = process.argv[2] ?? 'all'

  if (!exists('./debug')) mkdir('./debug')

  for (let version of versions) {
    if (file !== 'all' && version !== file) continue

    const contents: TexturesType = (await import(`../textures/${version}`)).default

    const output = contents.items
      .reduce((acc, item) => acc + `<img src="${item.texture}" alt="${item.readable}" title="${item.readable} (${item.id})" />`, '')
  
    const html = oneLine(`
      <html>
        <head>
          <style>
            body { max-width: ${32 * 16}px; }
          </style>
        </head>
        <body>
          <span>Version: ${version}, Items Count: ${contents.items.length}</span>
          <div style="display:flex;flex-wrap:wrap;">
            ${output}
          </div>
        </body>
      </html>
    `)

    write(`./debug/debug-${version}.html`, html)
  }
}

main()

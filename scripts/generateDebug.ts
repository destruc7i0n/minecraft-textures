import { writeFileSync, existsSync, mkdirSync } from 'fs'

import type { TexturesType } from '../lib/types'

import { versions, textures } from '../index'

const oneLine = (string: string) => string.split('\n').map(s => s.trim()).join('')

// generates a debug sheet of the textures in an html file
const main = async () => {
  const file = process.argv[2] ?? 'all'

  if (!existsSync('./debug')) mkdirSync('./debug')

  for (let versionId of versions) {
    const fileName = textures[versionId]
    if (file !== 'all' && fileName !== file) continue

    const contents: TexturesType = (await import(`../textures/${fileName}`)).default

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
          <span>File: ${versionId}, Items Count: ${contents.items.length}</span>
          <div style="display:flex;flex-wrap:wrap;">
            ${output}
          </div>
        </body>
      </html>
    `)

    writeFileSync(`./debug/debug-${fileName}.html`, html)
  }
}

main()

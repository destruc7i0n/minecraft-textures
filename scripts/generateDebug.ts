import { writeFileSync } from 'fs'

import { TexturesType } from '../lib/types'

const defaultFile = '116'

const oneLine = (string: string) => string.split('\n').map(s => s.trim()).join('')

// generates a debug sheet of the textures in an html file
const main = async () => {
  const file = process.argv[2] ?? defaultFile

  const contents: TexturesType = (await import(`../textures/${file}`)).default

  const output = contents.items
    .reduce((acc, item) => acc + `<img src="${item.texture}" alt="${item.readable}" title="${item.id}" />`, '')

  const html = oneLine(`
    <html>
      <head>
        <style>
          body { max-width: ${32 * 16}px; }
        </style>
      </head>
      <body>
        <span>File: ${file}.ts, Items Count: ${contents.items.length}</span>
        <div style="display:flex;flex-wrap:wrap;>
          ${output}
        </div>
      </body>
    </html>
  `)
  
  writeFileSync(`./debug-${file}.html`, html)
}

main()

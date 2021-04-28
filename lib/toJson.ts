import { writeFileSync as write, existsSync as exists, mkdirSync as mkdir } from 'fs'
import { resolve } from 'path'
import { versions } from '../index'
import { TexturesType, TexturesTypeById } from './types'

// convert the js to json for npm
const main = async () => {
  for (let version of versions) {
    const textures: TexturesType = (await import(resolve(`./textures/${version.replace('.', '')}.ts`))).default

    // sequential array
    if (!exists('./dist/textures/json')) mkdir('./dist/textures/json', { recursive: true })
    write(`./dist/textures/json/${version}.json`, JSON.stringify(textures, null, 2))

    // by id in object
    const byId: TexturesTypeById = {
      comment: textures.comment,
      items: textures.items.reduce((acc, el) => ({ ...acc, [el.id]: { readable: el.readable, texture: el.texture } }), {})
    }
    write(`./dist/textures/json/${version}.id.json`, JSON.stringify(byId, null, 2))
  }
}

main()

import { writeFileSync as write, existsSync as exists, mkdirSync as mkdir } from 'fs'
import { resolve } from 'path'
import byVersion, { versions } from '../index'

// convert the js to json for npm
const main = async () => {
  for (let version of versions) {
    const { default: textures } = await import(resolve(`./textures/${version.replace('.', '')}.ts`))

    if (!exists('./dist/textures/json')) mkdir('./dist/textures/json', { recursive: true })
    write(`./dist/textures/json/${version}.json`, JSON.stringify(textures, null, 2))
  }
}

main()

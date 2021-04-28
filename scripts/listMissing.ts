import { writeFileSync } from 'fs'
import fetch from 'node-fetch'

import type { TexturesType } from '../lib/types'
import { latestVersion, textures } from '../index'

// latest list of items from the reports
const ITEMS_FILE = 'https://github.com/Arcensoth/mcdata/raw/master/processed/reports/registries/item/data.json'

// lists all the missing items, probably from a new version
const main = async () => {
  const { values: allItems }: { values: string[] } = await (await fetch(ITEMS_FILE)).json()

  const latest: TexturesType = (await import(`../textures/${textures[latestVersion]}.ts`)).default
  const ids = latest.items.map(i => i.id)

  // compare files and exclude air
  const diff = allItems.filter(v => !ids.includes(v) && v !== 'minecraft:air')
  
  writeFileSync('./missing.json', JSON.stringify(diff, null, 2))
}

main()

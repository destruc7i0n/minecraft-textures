/* TheDestruc7i0n 2021 */

export const latestVersion = '1.17' as const
export const textures = {
  '1.12': '112',
  '1.13': '113',
  '1.14': '114',
  '1.15': '115',
  '1.16': '116',
  '1.17': '117',
} as const

export const versions = Object.keys(textures) as (keyof typeof textures)[]
export const latestVersionFileName = textures[latestVersion]

const hasVersion = (version: string) => Object.keys(textures).includes(version)

export * from './lib/types'

export default hasVersion

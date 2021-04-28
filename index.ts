/* TheDestruc7i0n 2021 */
const textures: { [key: string]: string } = {
  '1.12': '112',
  '1.13': '113',
  '1.14': '114',
  '1.15': '115',
  '1.16': '116',
}

const hasVersion = (version: string) => Object.keys(textures).includes(version)

export const versions = Object.keys(textures)
export const latestVersion = versions[versions.length - 1]
export { textures }
export default hasVersion

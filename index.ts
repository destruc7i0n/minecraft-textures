/* TheDestruc7i0n 2021 */
export const textures = ['1.12', '1.13', '1.14', '1.15', '1.16', '1.17']

export const versions = textures // reverse compatibility, removed next version!
export const latestVersion = textures[textures.length - 1]

const hasVersion = (version: string) => Object.keys(textures).includes(version)

export * from './lib/types'

export default hasVersion

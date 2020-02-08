/* TheDestruc7i0n 2020 */

const textures: { [key: string]: string } = {
    '1.12': '112',
    '1.13': '113',
    '1.14': '114',
    '1.15': '115',
    '1.16': '116',
}

const byVersion = async (version: string) => {
    // cast to string if needed
    version = String(version)
    // check if the texture exists and return accordingly
    if (textures.hasOwnProperty(version)) {
        // return a promise to the file
        const { default: tex } = await import(`./textures/${textures[version]}`)
        return tex
    }
    return {}
}

export const versions = Object.keys(textures)
export const latestVersion = versions[versions.length - 1]
export { textures }
export default byVersion

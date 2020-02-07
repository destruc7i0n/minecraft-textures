/* TheDestruc7i0n 2020 */

const textures = {
    '1.12': '112',
    '1.13': '113',
    '1.14': '114',
    '1.15': '115',
    '1.16': '116',
}

const byVersion = async (version) => {
    // cast to string if needed
    version = String(version)
    // check if the texture exists and return accordingly
    if (textures.hasOwnProperty(version)) {
        // return a promise to the file
        const { default: textures } = await import(`./textures/${textures[version]}`)
        return textures
    }
    return {}
}

export const versions = Object.keys(textures)
export const latestVersion = versions[versions.length - 1]
export { textures }
export default byVersion

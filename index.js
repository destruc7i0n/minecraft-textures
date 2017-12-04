/* TheDestruc7i0n 2017 */

const textures = {
    '1.12': require('./textures/112').items,
    '1.13': require('./textures/113').items
}

const byVersion = (version) => {
    // cast to string if needed
    const version = String(version)
    // check if the texture exists and return accordingly
    return textures.hasOwnProperty(version) ?
        textures[version] :
        null
}

// export the version keyd
export const versions = Object.keys(textures)
export default byVersion

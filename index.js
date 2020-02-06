/* TheDestruc7i0n 2020 */

const textures = {
    '1.12': require('./textures/112').default,
    '1.13': require('./textures/113').default,
    '1.14': require('./textures/114').default,
    '1.15': require('./textures/115').default,
}

const byVersion = (version) => {
    // cast to string if needed
    version = String(version)
    // check if the texture exists and return accordingly
    return textures.hasOwnProperty(version) ?
        textures[version] :
        {}
}

export const versions = Object.keys(textures)
export { textures }
export default byVersion

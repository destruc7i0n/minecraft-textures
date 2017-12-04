/* TheDestruc7i0n 2017 */

const textures = {
    '1.12': require('./textures/112'),
    '1.13': require('./textures/113')
}

const byVersion = (version) => {
    // cast to string if needed
    version = String(version)
    // check if the texture exists and return accordingly
    return textures.hasOwnProperty(version) ?
        textures[version] :
        {}
}

module.exports = {
    versions: Object.keys(textures),
    default: byVersion
}

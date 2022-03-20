const fs = require('fs')
const path = require('path')

const files = fs.readdirSync('./textures')

const entryPoints = files.reduce((acc, el) => {
  const fileName = path.basename(el, path.extname(el))
  acc[fileName] = path.resolve('./textures', el)
  return acc
}, {})

module.exports = {
  entry: {
    'minecraft-textures': './index.ts',
    ...entryPoints,
  },
  mode: 'production',
  output: {
    filename: (chunkData) => {
      if (chunkData.chunk.name !== 'minecraft-textures') {
        return `textures/[name].js`
      }
      return 'minecraft-textures.js'
    },
    library: 'minecraft-textures',
    libraryTarget: 'umd',
    globalObject: 'this',
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          'ts-loader'
        ],
        exclude: /node_modules/,
      },
    ]
  },
  resolve: {
    extensions: ['.ts', '.js', '.json']
  }
}

const webpack = require('webpack')
const path = require('path')

module.exports = {
  entry: {
    'minecraft-textures': './index.js',
    '1.12': './textures/112',
    '1.13': './textures/113',
    '1.14': './textures/114',
    '1.15': './textures/115',
    '1.16': './textures/116',
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
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
}

module.exports = {
  entry: {
    'minecraft-textures': './index.ts',
    '1.12': './textures/112.ts',
    '1.13': './textures/113.ts',
    '1.14': './textures/114.ts',
    '1.15': './textures/115.ts',
    '1.16': './textures/116.ts',
    '1.17': './textures/117.ts',
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

const nodeExternals = require('webpack-node-externals')

module.exports = {
  entry: './src/app.ts',
  target: 'node',
  cache: true,
  output: {
    filename: 'app.js',
    path: `${process.cwd()}/dist`,
  },
  // devtool: 'inline-source-map',
  externals: [nodeExternals()],
  module: {
    rules: [{
      test: /\.ts$/,
      use: 'ts-loader',
      exclude: /node_modules/,
    }]
  },
  resolve: {
    extensions: [".ts", ".js"],
    alias: {
      "@": "./",
    },
  }
}
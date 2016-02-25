// var ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
  entry: {
    index: './src/front/index.tsx',
    ca: './src/front/ca.ts'
  },
  output: {
    filename: './static/dist/[name].js'
  },
  target: 'electron',
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js']
  },
  module: {
    loaders: [
      {
        test: /\.tsx?$/,
        loader: 'babel!ts-loader'
      },
      {
        test: /\.less$/,
        loader: 'style!css!less'
      }
    ]
  },
  externals: [{

  }],
  plugins: [

  ],
  devtool: 'source-map'
}

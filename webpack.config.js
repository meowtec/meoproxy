// var ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
  entry: {
    index: './src/front/index.tsx',
    ca: './src/front/ca.ts'
  },
  output: {
    filename: './static/dist/[name].js'
  },
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
        // loader: ExtractTextPlugin.extract('style-loader', 'css-loader!less-loader')
      }
    ]
  },
  externals: [
    function(context, request, callback) {
      if(/^[a-zA-Z]/.test(request)) {
        return callback(null, 'commonjs ' + request)
      } else {
        callback()
      }
    }
  ],
  plugins: [
    // new ExtractTextPlugin('./dist/[name].css', {
    //   allChunks: true
    // })
  ],
  devtool: 'source-map'
}

'use strict'

const path = require('path')
const ExtractTextPlugin = require("extract-text-webpack-plugin")

function customLoader(name) {
  return path.resolve(__dirname, './loaders/' + name + '.js')
}

const config = {
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
        test: /\.svg$/,
        loader: customLoader('svg-spirit')
      }
    ]
  },
  externals: [
    {
      codemirror: 'CodeMirror',
      qrcode: 'QRCode'
    },
    function(context, request, callback) {
      if (!/^[a-zA-Z]/.test(request)) {
        callback()
      } else {
        return callback(null, 'commonjs ' + request)
      }
    }
  ],
  plugins: []
}

if (process.env.MEOP_ENV === 'dev_watch') {
  config.module.loaders.push({
    test: /\.less$/,
    loader: 'style!css!less'
  })
  config.devtool = 'source-map'
}
else {
  config.plugins.push(new ExtractTextPlugin("./static/dist/[name].css"))
  config.module.loaders.push({
    test: /\.less$/,
    loader: ExtractTextPlugin.extract('style', 'css!less')
  })
}

module.exports = config

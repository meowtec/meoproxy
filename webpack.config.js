const path = require('path')

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
      },
      {
        test: /\.svg$/,
        loader: path.resolve(__dirname, './script/svg-loader.js')
      }
    ]
  },
  externals: [
    {
      codemirror: 'CodeMirror'
    },
    function(context, request, callback) {
      if (!/^[a-zA-Z]/.test(request)) {
        callback()
      } else {
        return callback(null, 'commonjs ' + request)
      }
    }
  ],
  plugins: [

  ],
  devtool: 'source-map'
}

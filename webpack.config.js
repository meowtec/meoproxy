var ExtractTextPlugin = require("extract-text-webpack-plugin")

module.exports = {
  entry: {
    index: './gui/src/index.js',
    ca: './gui/src/ca.js'
  },
  output: {
    filename: "./gui/dist/[name].js"
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel'
      },
      {
        test: /\.less$/,
        // loader: "style!css!less"
        loader: ExtractTextPlugin.extract("style-loader", "css-loader!less-loader")
      }
    ]
  },
  externals: [
    function(context, request, callback) {
      if(/^[a-zA-Z]/.test(request)) {
        return callback(null, "commonjs " + request)
      } else {
        callback()
      }
    }
  ],
  plugins: [
    new ExtractTextPlugin("./gui/dist/[name].css", {
      allChunks: true
    })
  ],
  devtool: 'source-map'
}

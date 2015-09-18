var fs = require('fs')
var path = require('path')

var debug = true
var cache = {}
let resdir = './res/'

function readFile(filename, data) {
  var content = cache[filename]
  if (!content) {
    content = fs.readFileSync(path.resolve(__dirname, resdir, filename)).toString()

    data = data || {}

    if (!debug) {
      cache[filename] = content
    }
  }
  return content
}

exports.get = readFile

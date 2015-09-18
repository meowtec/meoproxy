var os = require('os')
var fs = require('fs')
var path = require('path')
var uuid = require('uuid')

var tempdir = path.resolve(os.tmpdir(), 'myproxy')

// 启动时清空 $temp/myproxy 目录
try {
  fs.unlinkSync(tempdir)
}
catch (e) {
  console.log(e)
}
try {
  fs.mkdirSync(tempdir)
}
catch (e) {
  console.log(e)
}

exports.readStream = function(id) {
  return fs.createReadStream(path.resolve(tempdir, id))
}

exports.writeStream = function(id) {
  return fs.createWriteStream(path.resolve(tempdir, id))
}

exports.uuid = function() {
  return uuid.v1()
}

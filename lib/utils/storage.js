'use strict'

var os = require('os')
var fs = require('fs')
var path = require('path')
var uuid = require('uuid')

var tempDir = path.resolve(os.tmpdir(), 'myproxy')

// 启动时清空 $temp/myproxy 目录
// try {
//   fs.unlinkSync(tempdir)
// }
// catch (e) {
//   console.log(e)
// }
try {
  fs.mkdirSync(tempDir)
}
catch (e) {
  console.log(e)
}

// 生成文件相对路径
function getPhysicPath(relativePath) {
  return path.resolve(tempDir, relativePath)
}

module.exports = {
  filePath() {
    return [].join.call(arguments, '.')
  },

  readStream(p) {
    return fs.createReadStream(getPhysicPath(p))
  },

  writeStream(p) {
    return fs.createWriteStream(getPhysicPath(p))
  },

  uuid() {
    return uuid.v1()
  },

  readFile(p) {
    return fs.readFileSync(getPhysicPath(p))
  },

  getTempDir() {
    return tempDir
  }
}

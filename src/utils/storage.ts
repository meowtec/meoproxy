'use strict'

import * as os from 'os'
import * as fs from 'fs'
import * as path from 'path'

const tempDir = path.resolve(os.tmpdir(), 'meoproxy')

// 获取文件相对路径
function getPhysicPath(relativePath: string) {
  return path.resolve(tempDir, relativePath)
}

export function initial() {
  try {
    fs.mkdirSync(tempDir)
  }
  catch (e) {
    console.log(e)
  }
}

export function filePath(...args) {
  return args.join('.')
}

export function readStream(path: string) {
  return fs.createReadStream(getPhysicPath(path))
}

export function writeStream(path: string) {
  return fs.createWriteStream(getPhysicPath(path))
}

export function readFile(path: string) {
  return fs.readFileSync(getPhysicPath(path))
}

export function writeFile(path: string, content) {
  return fs.writeFileSync(getPhysicPath(path), content)
}

export function getTempDir() {
  return tempDir
}

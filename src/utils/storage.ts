'use strict'

import * as os from 'os'
import * as fs from 'fs'
import * as path from 'path'
import * as uuidtools from 'uuid'

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

export function readStream(p: string) {
  return fs.createReadStream(getPhysicPath(p))
}

export function writeStream(p: string) {
  return fs.createWriteStream(getPhysicPath(p))
}

export function uuid() {
  return uuidtools.v1()
}

export function readFile(p: string) {
  return fs.readFileSync(getPhysicPath(p))
}

export function getTempDir() {
  return tempDir
}

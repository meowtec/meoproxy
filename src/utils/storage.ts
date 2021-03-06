'use strict'

import * as os from 'os'
import * as fs from 'fs'
import * as path from 'path'
import * as mkdirp from 'mkdirp'
import { fs as fsAsync } from './catro-utils'
import { app, remote } from 'electron'

class Bundle {

  private _basePath: string

  constructor(basePath: string) {
    try {
      mkdirp.sync(basePath)
    } catch (e) {
      if (!(e.code === 'EEXIST' && fs.statSync(basePath).isDirectory())) {
        throw e
      }
    }
    this._basePath = basePath
  }

  basePath() {
    return this._basePath
  }

  path(id: string) {
    return path.resolve(this.basePath(), id)
  }

  read(id: string) {
    return fs.readFileSync(this.path(id))
  }

  write(id: string, data) {
    return fs.writeFileSync(this.path(id), data)
  }

  writeAsync(id: string, data) {
    return fsAsync.writeFile(this.path(id), data)
  }

  readStream(id: string) {
    return fs.createReadStream(this.path(id))
  }

  writeStream(id: string) {
    return fs.createWriteStream(this.path(id))
  }

}

const appRef = app || remote && remote.app
export const cacheBundle = new Bundle(path.resolve(os.tmpdir(), 'meoproxy'))
export const configBundle = new Bundle(path.resolve(appRef.getPath('userData'), 'config'))

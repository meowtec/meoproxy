'use strict'

import  * as fileSystem from 'fs'
import { EventEmitter } from 'events'

export default function promisify(callback: Function, context?, ifErr?: boolean) {

  if (ifErr == null) {
    ifErr = true
  }

  return function(arg1?, arg2?) {
    const args = [].slice.call(arguments)

    return new Promise((resolve, reject) => {
      args.push(function(err) {
        let rest = arguments
        if (ifErr) {
          rest = [].slice.call(rest, 1)
        }

        if (err && ifErr) {
          reject(err)
        }
        else {
          resolve.apply(null, rest)
        }
      })
      callback.apply(context, args)
    })
  }
}


export const emitterPromisify = function(emitter: EventEmitter, eventName: string, exception?: boolean) {
  // TODO: use `exception: boolean = true`
  if (exception == null) {
    exception = true
  }

  return new Promise(function(resolve, reject) {
    emitter.on(eventName, resolve)
    exception && emitter.on('error', reject)
  })
}

export interface ReadFilePromise {
  (path: string): Promise<Buffer>
  (path: string, encoding: string): Promise<string>
}

export interface BooleanPromise {
  (path: string): Promise<boolean>
}

export const fs = {
  readFile: <ReadFilePromise>promisify(fileSystem.readFile, fileSystem),
  unlink: promisify(fileSystem.unlink, fileSystem),
  exists: <BooleanPromise>promisify(fileSystem.exists, fileSystem, false)
}

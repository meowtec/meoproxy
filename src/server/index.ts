'use strict'

import Proxy from 'catro'
import { RequestHandler } from 'catro'
import * as _ from '../utils/utils'
import * as storage from '../utils/storage'
import { Readable } from 'stream'
import { IpcData, ipcDataState, Type } from '../typed/typed'
import { shouldBreak } from './options'
import replace from './replace'

storage.initial()

export default function setup(window: GitHubElectron.BrowserWindow) {
  const renderer = window.webContents
  const proxy = new Proxy({
    port: 8899
  })

  function ipcSend(data: IpcData) {
    renderer.send('http-data', data)
  }

  proxy.on('open', (handler: RequestHandler) => {
    /** generate an uid */
    const id = _.id()
    const url = handler.url
    const hasBreak = shouldBreak(url)
    if (hasBreak) {
      console.log(url, 'will be replaced!!')
      handler.replaceRequest = replace(id, Type.request)
      handler.replaceResponse = replace(id, Type.response)
    }

    ; {
      /** Storage request */
      let storageId
      if (handler.request.method.toUpperCase() !== 'GET') {
        storageId = storage.filePath(id, 'request')
        ; (<Readable>handler.request.body).pipe(storage.writeStream(storageId))
      }

      ipcSend({
        id,
        state: ipcDataState.open,
        protocol: handler.protocol,
        breakpoint: hasBreak,
        request: Object.assign({}, handler.request, {
          storageId,
          body: null
        })
      })

    }

    handler.on('requestFinish', () => {
      ipcSend({
        id,
        state: ipcDataState.requestFinish,
      })
    })

    handler.on('response', () => {
      const storageId = storage.filePath(id, 'response')
      const writeable = storage.writeStream(storageId)
      ; (<Readable>handler.response.body).pipe(writeable)

      ipcSend({
        id,
        state: ipcDataState.response,
        response: Object.assign({}, handler.response, {
          storageId,
          body: null
        })
      })

      writeable.on('finish', () => {
        ipcSend({
          id,
          state: ipcDataState.responseFinish,
          breakpoint: hasBreak
        })
      })
    })

    handler.on('finish', () => {
      ipcSend({
        id,
        state: ipcDataState.finish
      })
    })
  })

}

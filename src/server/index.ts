'use strict'

import Proxy from 'catro'
import { RequestHandler } from 'catro'
import * as _ from '../utils/utils'
import * as storage from '../utils/storage'
import { Readable } from 'stream'
import { IpcData, ipcDataState } from '../typed/typed'

storage.initial()

export default function setup(window: GitHubElectron.BrowserWindow) {
  const renderer = window.webContents
  const proxy = new Proxy({
    port: 8899
  })

  proxy.on('open', (handler: RequestHandler) => {
    const id = _.id()

    ; {
      /** Storage request */
      let storageId
      if (handler.request.method.toUpperCase() !== 'GET') {
        storageId = storage.filePath(id, 'request')
        ; (<Readable>handler.request.body).pipe(storage.writeStream(storageId))
      }

      renderer.send('http-data', <IpcData>{
        id,
        state: ipcDataState.open,
        scheme: handler.scheme,
        request: Object.assign({}, handler.request, {
          storageId,
          body: null
        })
      })
    }

    handler.on('requestFinish', () => {
      renderer.send('http-data', <IpcData>{
        id,
        state: ipcDataState.requestFinish,
      })
    })

    handler.on('response', () => {
      const storageId = storage.filePath(id, 'response')
      const writeable = storage.writeStream(storageId)
      ; (<Readable>handler.response.body).pipe(writeable)

      renderer.send('http-data', <IpcData>{
        id,
        state: ipcDataState.response,
        response: Object.assign({}, handler.response, {
          storageId
        })
      })

      writeable.on('finish', () => {
        renderer.send('http-data', <IpcData>{
          id,
          state: ipcDataState.responseFinish
        })
      })
    })

    handler.on('finish', () => {
      renderer.send('http-data', <IpcData>{
        id,
        state: ipcDataState.finish
      })
    })
  })

}

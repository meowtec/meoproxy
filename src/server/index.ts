'use strict'

import Proxy from 'catro'
import { RequestHandler } from 'catro'
import * as electron from 'electron'
import * as _ from '../utils/utils'
import * as storage from '../utils/storage'
import { Writable, Readable } from 'stream'
import { ipcData, ipcDataState } from '../typed/typed'

import { BrowserWindow } from 'electron'

storage.initial()

export default function setup(window: GitHubElectron.BrowserWindow) {
  const renderer = window.webContents
  const proxy = new Proxy({
    port: 8899
  })

  proxy.on('open', (handler: RequestHandler) => {
    const id = _.id()

    ;{
      /** Storage request */
      const storageId = storage.filePath(id, 'request')
      const writeable = storage.writeStream(storageId)
      ;(<Readable>handler.request.body).pipe(writeable)

      renderer.send('http-data', <ipcData>{
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
      renderer.send('http-data', <ipcData>{
        id,
        state: ipcDataState.requestFinish,
      })
    })

    handler.on('response', () => {
      const storageId = storage.filePath(id, 'response')
      const writeable = storage.writeStream(storageId)
      ;(<Readable>handler.response.body).pipe(writeable)

      renderer.send('http-data', <ipcData>{
        id,
        state: ipcDataState.response,
        response: Object.assign({}, handler.response, {
          storageId
        })
      })

      writeable.on('finish', () => {
        renderer.send('http-data', <ipcData>{
          id,
          state: ipcDataState.responseFinish
        })
      })
    })

    handler.on('finish', () => {
      renderer.send('http-data', <ipcData>{
        id,
        state: ipcDataState.finish
      })
    })
  })

}

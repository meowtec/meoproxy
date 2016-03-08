'use strict'

import Proxy from 'catro'
import { RequestHandler } from 'catro'
import * as _ from '../utils/utils'
import * as storage from '../utils/storage'
import { Readable } from 'stream'
import { IpcData, ipcDataState, Type } from '../typed/typed'
import { shouldBreak } from './options'
import replace from './replace'
import * as log4js from 'log4js'

storage.initial()

const logger = log4js.getLogger('server/index')

export default function setup(options: {
  send(data: IpcData): void
}) {

  const send = options.send

  const proxy = new Proxy({
    port: 8899
  })

  proxy.on('open', (handler: RequestHandler) => {
    if (handler.req.url.startsWith('/')) {
      return
    }
    /** generate an uid */
    const id = _.id()
    const url = handler.url
    const hasBreak = shouldBreak(url)
    if (hasBreak) {
      logger.info('Will replace:', url)
      handler.replaceRequest = replace(id, Type.request)
      handler.replaceResponse = replace(id, Type.response)
    }

    {
      /** Storage request */
      let storageId
      if (handler.request.method.toUpperCase() !== 'GET') {
        storageId = storage.filePath(id, 'request')
        ; (<Readable>handler.request.body).pipe(storage.writeStream(storageId))
      }

      send({
        id,
        state: ipcDataState.open,
        protocol: handler.protocol,
        breakpoint: hasBreak ? Type.request : null,
        request: Object.assign({}, handler.request, {
          storageId,
          body: null
        })
      })

    }

    handler.on('requestFinish', () => {
      send({
        id,
        state: ipcDataState.requestFinish,
      })
    })

    handler.on('response', () => {
      const storageId = storage.filePath(id, 'response')
      const writeable = storage.writeStream(storageId)
      ; (<Readable>handler.response.body).pipe(writeable)

      send({
        id,
        state: ipcDataState.response,
        response: Object.assign({}, handler.response, {
          storageId,
          body: null
        })
      })

      writeable.on('finish', () => {
        send({
          id,
          state: ipcDataState.responseFinish,
          breakpoint: hasBreak ? Type.response : null
        })
      })
    })

    handler.on('finish', () => {
      send({
        id,
        state: ipcDataState.finish
      })
    })
  })

}

'use strict'

import Proxy from 'catro'
import { IncomingMessage, ServerResponse } from 'http'
import * as url from 'url'
import * as fs from 'fs'
import * as os from 'os'
import { RequestHandler, HttpsConnect } from 'catro'
import * as _ from '../utils/utils'
import { cacheBundle } from '../utils/storage'
import { Readable } from 'stream'
import { IpcHTTPData, ipcDataState, MessageType } from '../typed/typed'
import userOptions from './options'
import replace from './replace'
import * as log4js from 'log4js'
import * as mkdirp from 'mkdirp'
import * as ipc from '../utils/ipc'

const logger = log4js.getLogger('server/index')

const certDir = os.homedir() + '/.meoproxy/cert'

mkdirp.sync(certDir)

const sendHttpIpc = (data: IpcHTTPData) => ipc.send('http-data', data)

export default function setup() {

  const proxy = new Proxy({
    port: 8899,
    certPath: certDir,
    https: userOptions.shouldHttpsInterrupt
  })

  proxy.on('open', (handler: RequestHandler) => {
    if (handler.req.url.startsWith('/') && handler.protocol === 'http') {
      return
    }
    /** generate an uid */
    const id = _.id()
    const url = handler.url
    const hasBreak = userOptions.shouldBreak(url)
    if (hasBreak) {
      logger.info('Will replace:', url)
      handler.replaceRequest = replace(id, MessageType.request)
      handler.replaceResponse = replace(id, MessageType.response)
    }

    {
      /** Storage request */
      let storageId
      if (handler.request.method.toUpperCase() !== 'GET') {
        storageId = [id, 'request'].join('.')
        ; (<Readable>handler.request.body).pipe(cacheBundle.writeStream(storageId))
      }

      sendHttpIpc({
        id,
        state: ipcDataState.open,
        protocol: handler.protocol,
        breakpoint: hasBreak ? MessageType.request : null,
        request: Object.assign({}, handler.request, {
          storageId,
          body: null
        })
      })

    }

    handler.on('requestFinish', () => {
      sendHttpIpc({
        id,
        state: ipcDataState.requestFinish,
      })
    })

    handler.on('response', () => {
      const storageId = [id, 'response'].join('.')
      const writeable = cacheBundle.writeStream(storageId)
      ; (<Readable>handler.response.body).pipe(writeable)

      sendHttpIpc({
        id,
        state: ipcDataState.response,
        response: Object.assign({}, handler.response, {
          storageId,
          body: null
        })
      })

      writeable.on('finish', () => {
        sendHttpIpc({
          id,
          state: ipcDataState.responseFinish,
          breakpoint: hasBreak ? MessageType.response : null
        })
      })
    })

    handler.on('finish', () => {
      sendHttpIpc({
        id,
        state: ipcDataState.finish
      })
    })
  })

  proxy.on('connect', (connect: HttpsConnect) => {
    ipc.send('https-connect', Object.assign({
      id: _.id()
    }, connect))
  })

  proxy.on('direct', (req: IncomingMessage, res: ServerResponse, prevent: Function) => {
    if (url.parse(req.url).path === '/ca.crt') {
      prevent()
      res.writeHead(200, {
        'Content-Type': 'application/x-x509-ca-cert'
      })
      fs.createReadStream(proxy.CACertPath).pipe(res)
    }
  })

  proxy.on('log:info', (...args) => {
    logger.info.apply(logger, args)
  })

  proxy.on('error', (...args) => {
    logger.error.apply(logger, args)
  })

  proxy.start().catch((e) => {
    logger.error('Start error', e)
  })

}

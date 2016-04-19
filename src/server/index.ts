'use strict'

import Proxy from 'catro'
import { IncomingMessage, ServerResponse } from 'http'
import * as url from 'url'
import * as fs from 'fs'
import * as os from 'os'
import { RequestHandler } from 'catro'
import * as _ from '../utils/utils'
import { cacheBundle } from '../utils/storage'
import { Readable } from 'stream'
import { IpcData, ipcDataState, Type } from '../typed/typed'
import { shouldBreak } from './options'
import replace from './replace'
import * as log4js from 'log4js'
import * as mkdirp from 'mkdirp'

const logger = log4js.getLogger('server/index')

const certDir = os.homedir() + '/.meoproxy/cert'

mkdirp.sync(certDir)

export default function setup(options: {
  send(data: IpcData): void
}) {

  const send = options.send

  const proxy = new Proxy({
    port: 8899,
    certPath: certDir,
    // TODO https options
    // if https is false, not show https menu
    https: true
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
        storageId = [id, 'request'].join('.')
        ; (<Readable>handler.request.body).pipe(cacheBundle.writeStream(storageId))
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
      const storageId = [id, 'response'].join('.')
      const writeable = cacheBundle.writeStream(storageId)
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

  proxy.on('error', (e) => {
    logger.error(e)
  })

  proxy.start().catch((e) => {
    logger.error('Start error', e)
  })

}

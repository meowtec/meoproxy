'use strict'

import { ipcRenderer as ipc } from 'electron'
import * as storage from '../../utils/storage'
import * as mine from '../../utils/content-type'
import { EventEmitter } from 'events'
import { Request, Response } from 'catro'
import { ipcDataState, IpcData, Type } from '../../typed/typed'

// export interface Detail {
//   id: string
//   ssl: boolean
//   state: ipcDataState
//   request: Request
//   response: Response
//   request_: Request
//   response_: Response
// }

export interface Bodies {
  requestBody?: string
  responseBody?: string
  requestBody_?: string
  responseBody_?: string
}

export { IpcData as Detail }

export interface MixedDetail extends IpcData, Bodies {}

export class Data extends EventEmitter {
  private _timeline: IpcData[];
  private _breakpoints: IpcData[];

  constructor() {
    super()

    this._timeline = []
    this._breakpoints = []

    this.listenEvents()
  }

  private listenEvents() {

    ipc.on('http-data', (event, data: IpcData) => {
      console.log('ipc.on \'http-data\' data => ', data)
      let detail

      /**
       * create a new detail
       */
      if (data.state === ipcDataState.open) {
        detail = data
        this.timeline.unshift(data)
      }
      /**
       * get exist detail
       * update it by state
       */
      else {
        detail = this.findTimelineItem(data.id)

        if (!detail) {
          return // Ignore error.
        }

        Object.assign(detail, data)

      }

      if (data.breakpoint != null) {
        this.breakpoints.push(data)
      }

      this.emit('update', detail)
    })
  }

  private findTimelineItem(id: string) {
    return this.timeline.find(item => item.id === id)
  }

  get timeline() {
    return this._timeline
  }

  get breakpoints() {
    return this._breakpoints
  }

  /** TODO cache. */
  getItem(id: string): MixedDetail {

    const detail = this.findTimelineItem(id)
    const bodies: Bodies = {}
    const request = detail.request
    const response = detail.response

    if (request && request.storageId) {
      bodies.requestBody = storage.readFile(request.storageId).toString()
    }

    if (response && response.storageId && mine.isText(response.headers['content-type'])) {
      bodies.responseBody = storage.readFile(response.storageId).toString()
    }

    return Object.assign(bodies, detail)
  }

  closeBreakPoint(id: string, type: Type, data: Request | Response) {
    let storageId
    if (data.body) {
      storageId = id + type + '.MODI'
      storage.writeFile(storageId, data.body)
    }

    const ipcData = Object.assign({}, data, {
      body: null,
      bodyId: storageId
    })

    ipc.send('replaced', {
      id: id,
      type,
      data: ipcData
    })
  }

}

export default new Data()

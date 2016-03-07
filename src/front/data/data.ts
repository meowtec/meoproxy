'use strict'

import { ipcRenderer as ipc } from 'electron'
import * as storage from '../../utils/storage'
import * as mine from '../../utils/content-type'
import { EventEmitter } from 'events'
import { Request, Response } from 'catro'
import { ipcDataState, IpcData, Type } from '../../typed/typed'


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
      // console.log('ipc.on \'http-data\' data => ', data)
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
        // TODO: may should clone?
        this.breakpoints.push(detail)
      }

      this.emit('update', detail)
    })
  }

  private findTimelineItem(id: string) {
    return this.timeline.find(item => item.id === id)
  }

  private findBreakPointItem(id: string, type: Type) {
    return this.breakpoints.find(item => item.id === id && item.breakpoint === type)
  }

  get timeline() {
    return this._timeline
  }

  get breakpoints() {
    return this._breakpoints
  }

  /** TODO 根据普通 item/breakpoint 区分下 */
  getMixedData(data: IpcData) {
    const bodies: Bodies = {}
    const request = data.request
    const response = data.response

    if (request && request.storageId) {
      bodies.requestBody = storage.readFile(request.storageId).toString()
    }

    if (response && response.storageId && mine.isText(response.headers['content-type'])) {
      bodies.responseBody = storage.readFile(response.storageId).toString()
    }

    return Object.assign(bodies, data)
  }
  /** TODO cache. */
  getItem(id: string): MixedDetail {
    const item = this.findTimelineItem(id)
    return this.getMixedData(item)
  }

  getBreakPoint(id: string, type: Type): MixedDetail {
    let breakpoint = this.findBreakPointItem(id, type)
    return this.getMixedData(breakpoint)
  }

  removeBreakPoint(item: IpcData) {
    let breakpoints = this._breakpoints
    let index = breakpoints.indexOf(item)
    index > -1 && breakpoints.splice(index, 1)
  }

  closeBreakPoint(id: string, type: Type, data: Request | Response) {
    const detail = this.findBreakPointItem(id, type)
    let storageId

    this.removeBreakPoint(detail)

    if (data.body) {
      storageId = id + detail.breakpoint + '.MODI'
      storage.writeFile(storageId, data.body)
    }

    const ipcData = Object.assign({}, data, {
      body: null,
      storageId: storageId
    })

    ipc.send('replaced', {
      id: id,
      type: detail.breakpoint,
      data: ipcData
    })
  }

}

export default new Data()

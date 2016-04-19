'use strict'

import { ipcRenderer as ipc } from 'electron'
import { cacheBundle } from '../../utils/storage'
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

export type DetailWithBody = IpcData & Bodies;

export { IpcData as Detail }

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
      let detail: IpcData

      /**
       * create a new detail
       */
      if (data.state === ipcDataState.open) {
        detail = data
        this.timeline.unshift(data)
      }
      /**
       * get exist detail
       * update it
       */
      else {
        detail = this.findTimelineItem(data.id)

        if (!detail) {
          return // Ignore error.
        }

        Object.assign(detail, data)
      }

      if (data.breakpoint != null) {
        const breapoint = Object.assign({}, detail)
        this.breakpoints.push(breapoint)
        this.emit('breakpoint-update', breapoint)
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
      bodies.requestBody = cacheBundle.read(request.storageId).toString()
    }

    if (response && response.storageId && mine.isText(response.headers['content-type'])) {
      bodies.responseBody = cacheBundle.read(response.storageId).toString()
    }

    return Object.assign(bodies, data)
  }

  /** TODO cache. */
  getItem(id: string): DetailWithBody {
    const item = this.findTimelineItem(id)
    return this.getMixedData(item)
  }

  getBreakPoint(id: string, type: Type): DetailWithBody {
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
      storageId = id + '_M'
      cacheBundle.write(storageId, data.body)
    }

    const ipcData = Object.assign({}, data, {
      body: null,
      storageId: storageId
    })

    ipc.send('replaced', {
      id,
      type: detail.breakpoint,
      data: ipcData
    })

    this.emit('breakpoint-rm')
  }

}

export default new Data()

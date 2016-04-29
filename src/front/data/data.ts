'use strict'

import { ipcRenderer as ipc } from 'electron'
import { cacheBundle } from '../../utils/storage'
import * as mine from '../../utils/content-type'
import { EventEmitter } from 'events'
import { Request, Response } from 'catro'
import { ipcDataState, IpcHTTPData, HttpsConnect, MessageType } from '../../typed/typed'


export interface Bodies {
  requestBody?: string
  responseBody?: string
  requestBody_?: string
  responseBody_?: string
}

export type DetailWithBody = IpcHTTPData & Bodies

export const timelineDataType = Symbol('timelineDataType')

export const enum TimelineDataType {
  http,
  connect
}

export class Data extends EventEmitter {
  private _timeline: (IpcHTTPData | HttpsConnect)[];
  private _breakpoints: IpcHTTPData[];

  constructor() {
    super()

    this._timeline = []
    this._breakpoints = []

    this.listenEvents()
  }

  private listenEvents() {

    ipc.on('http-data', (event, data: IpcHTTPData) => {
      // console.log('ipc.on \'http-data\' data => ', data)
      let detail: IpcHTTPData

      /**
       * create a new detail
       */
      if (data.state === ipcDataState.open) {
        detail = data
        this.timeline.unshift(data)
        data[timelineDataType] = TimelineDataType.http
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

    ipc.on('https-connect', (devent, data: HttpsConnect) => {
      console.debug('connect', data)
      data[timelineDataType] = TimelineDataType.connect
      this.timeline.unshift(data)

      this.emit('update')
    })
  }

  private findTimelineItem(id: string) {
    return <IpcHTTPData>this.timeline.find((item: IpcHTTPData) => {
      return item[timelineDataType] === TimelineDataType.http && item.id === id
    })
  }

  private findBreakPointItem(id: string, type: MessageType) {
    return this.breakpoints.find(item => item.id === id && item.breakpoint === type)
  }

  get timeline() {
    return this._timeline
  }

  get breakpoints() {
    return this._breakpoints
  }

  /** TODO 根据普通 item/breakpoint 区分下 */
  getMixedData(data: IpcHTTPData) {
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

  getBreakPoint(id: string, type: MessageType): DetailWithBody {
    let breakpoint = this.findBreakPointItem(id, type)
    return this.getMixedData(breakpoint)
  }

  removeBreakPoint(item: IpcHTTPData) {
    let breakpoints = this._breakpoints
    let index = breakpoints.indexOf(item)
    index > -1 && breakpoints.splice(index, 1)
  }

  closeBreakPoint(id: string, type: MessageType, data: Request | Response) {
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

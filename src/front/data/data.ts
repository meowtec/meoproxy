'use strict'

import { ipcRenderer } from 'electron'
import event from '../../utils/event'
import * as assert from 'assert'
import * as __ from 'lodash'
import * as storage from '../../utils/storage'

import { Headers, Request, Response, ipcData, ipcDataState } from '../../typed/typed'

export interface Detail {
  id: string
  state: ipcDataState
  request: Request
  response: Response
  request_: Request
  response_: Response
}

export interface Bodies {
  requestBody?: string
  responseBody?: string
  requestBody_?: string
  responseBody_?: string
}

const timeline:Detail[] = [] // Map -> React Elements 性能较低

const find = (id: string) => timeline.find(item => item.id === id)


ipcRenderer.on('http-data', (sender, data: Detail) => {
  console.log('ipc.on \'http-data\' data => ', data)
  let detail

  /**
   * create a new detail
   */
  if (data.state === ipcDataState.open) {
    detail = data
    timeline.unshift(data)
  }
  /**
   * get exist detail
   * update it by state
   */
  else {
    detail = find(data.id)

    if (!detail) {
      return // Ignore error.
    }

    Object.assign(detail, data)

  }

  event.emit('timeline-update', detail)
})

// 获取 TimeLine
export const getTimeline = () => timeline

// 获取记录细则
// TODO: 缓存最近几次的 bodyData
export const getItem = (id: string) => {

  let detail = find(id)

  let bodies: Bodies = {}

  if (detail.request && detail.request.storageId) {
    bodies.requestBody = storage.readFile(detail.request.storageId).toString()
  }

  if (detail.response && detail.response.storageId) {
    bodies.responseBody = storage.readFile(detail.response.storageId).toString()
  }


  return Object.assign(bodies, detail)
}

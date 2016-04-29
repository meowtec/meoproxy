'use strict'

import { EventEmitter } from 'events'
import { ipcMain } from 'electron'
import { Request, Response, MessageType } from '../typed/typed'
import { cacheBundle } from '../utils/storage'

const event = new EventEmitter()

const eventName = (id, type) => id + '_' + type

ipcMain.on('replaced', (sender, data: {
  id: string
  type: MessageType
  data: Request | Response
}) => {
  const catroData = data.data
  if (catroData.storageId) {
    catroData.body = cacheBundle.readStream(catroData.storageId)
  }
  event.emit(eventName(data.id, data.type), data.data)
})

export default (id: string, type: MessageType) => (data, handler) =>
    new Promise(event.once.bind(event, eventName(id, type)))

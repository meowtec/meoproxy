'use strict'

import { EventEmitter } from 'events'
import { ipcMain } from 'electron'
import { Request, Response, Type } from '../typed/typed'

const event = new EventEmitter()

const eventName = (id, type) => id + '_' + type

ipcMain.on('replaced', (event, data: {
  id: string
  type: Type
  data: Request | Response
}) => {
  event.emit(eventName(data.id, data.type), data.data)
})

export default (id: string, type: Type) => (data, handler) =>
    new Promise(event.once.bind(event, eventName(id, type)))

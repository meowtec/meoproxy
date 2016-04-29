'use strict'

import { BrowserWindow } from 'electron'
import { IpcChannelMain } from '../typed/typed'

type BrowserWindow = Electron.BrowserWindow

export type WindowId = 'main'

const windows = new Map<WindowId, BrowserWindow>()

export function setRender(window: BrowserWindow , id: WindowId = 'main') {
  windows.set(id, window)
}

export function getRender(id: WindowId = 'main') {
  return windows.get(id)
}

export function send(channel: IpcChannelMain, data, winId: WindowId = 'main') {
  getRender(winId).webContents.send(channel, data)
}

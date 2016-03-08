'use strict'

import { BrowserWindow } from 'electron'
import * as path from 'path'

export default function openCaPage() {
  const caWindow = new BrowserWindow({width: 300, height: 420})
  caWindow.loadURL('file://' + path.resolve() + '/static/ca.html')
  caWindow.webContents.openDevTools()
}

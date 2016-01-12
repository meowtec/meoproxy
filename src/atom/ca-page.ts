'use strict'

import { BrowserWindow } from 'electron'
import * as ip from 'ip'

export default function openCaPage() {
  const caWindow = new BrowserWindow({width: 300, height: 400})
  caWindow.loadURL('file://' + __dirname + '/../../gui/ca.html?ip=' + ip.address())
}

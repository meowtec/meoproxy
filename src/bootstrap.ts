'use strict'

import * as electron from 'electron'
import * as storage from './utils/storage'
import * as path from 'path'
import event from './utils/event'
import appMenuSetup from './atom/menu'

import server from './server/'

const app = electron.app
const BrowserWindow = electron.BrowserWindow

// console.log(app.getPath('userData'))
// console.log(app.getPath('cache'))
// console.log(app.getPath('temp'))

// Report crashes to our server.
// electron.crashReporter.start()

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is GCed.

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
  // 设置 menu
  appMenuSetup()

  // Create the browser window.
  const window = new BrowserWindow({width: 1200, height: 800})

  // and load the index.html of the app.
  window.loadURL('file://' + path.resolve() + '/static/index.html')

  // Open the devtools.
  window.webContents.openDevTools()

  // Emitted when the window is closed.
  window.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    // exit
    app.quit()
  })

  server(window)
})
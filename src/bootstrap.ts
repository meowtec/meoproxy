'use strict'

import * as electron from 'electron'
import * as path from 'path'
import appMenuSetup from './atom/menu'
import serverSetup from './server/'
import * as log4js from 'log4js'
import * as ipc from './utils/ipc'

const logger = log4js.getLogger('bootstrap')

const app = electron.app
const BrowserWindow = electron.BrowserWindow

logger.info('USERDATA dir:', app.getPath('userData'))
logger.info('TEMP dir:', app.getPath('temp'))
// Report crashes to our server.
// electron.crashReporter.start()

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is GCed.

// Quit when all windows are closed.
app.on('window-all-closed', function(x, v) {
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
  const window = new BrowserWindow({
    width: 1200,
    height: 800,
    useContentSize: true,
    minWidth: 800,
    titleBarStyle: 'hidden'
  })

  // and load the index.html of the app.
  // window.loadURL()
  window.loadURL(`file://${path.resolve()}/static/index.html`)

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

  ipc.setRender(window)

  serverSetup()
})

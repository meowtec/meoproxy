var app = require('app')  // Module to control application life.
var BrowserWindow = require('browser-window')  // Module to create native browser window.
// var co = require('co')
var ipc = require('ipc')
var storage = require('./utils/storage')
var event = require('./utils/event')

var appMenuSetup = require('./atom/menu')

require('./server/')

console.log(app.getPath('userData'))
console.log(app.getPath('cache'))
console.log(app.getPath('temp'))

// Report crashes to our server.
require('crash-reporter').start()

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is GCed.
var mainWindow = null

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
  mainWindow = new BrowserWindow({width: 1000, height: 800})

  // and load the index.html of the app.
  mainWindow.loadUrl('file://' + __dirname + '/../gui/index.html')

  // Open the devtools.
  mainWindow.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
})

// 通信：
// ipc 为页面进程~主进程
// event 为主进程服务器模块~调度中心

ipc.on('get-body-data', function(id) {
  storage.readStream(id).then(function(data) {
    ipc.send('response-body-data', data)
  })
})

event.on('http-message', function(data) {
  ipc.send('http-message', data)
})

// test event
event.on('http-data', function(data) {
  mainWindow.send && mainWindow.send('http-data', data)
})

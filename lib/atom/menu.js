var Menu = require('menu')
var dialog = require('dialog')

var caPage = require('./ca-page')
var ip = require('ip')

module.exports = function() {
  var template = [
    {
      label: 'Window',
      role: 'window',
      submenu: [
        {
          label: 'Minimize',
          accelerator: 'CmdOrCtrl+M',
          role: 'minimize'
        },
        {
          label: 'Close',
          accelerator: 'CmdOrCtrl+W',
          role: 'close'
        },
      ]
    },
    {
      label: 'HTTPS',
      submenu: [
        {
          label: 'Install CA',
          click: function(item, focusedWindow) {
            caPage()
          }
        },
        {
          label: 'Enable',
          click: function(item, focusedWindow) {

          }
        },
        {
          label: 'IP address',
          click: function() {
            let ipAddr = ip.address()
            dialog.showMessageBox({
              type: 'none',
              title: 'IP address',
              detail: `把手机连接到电脑所在局域网，将代理地址设置到 ${ipAddr}:8899`,
              message: ipAddr,
              buttons: ['OK']
            })
          }
        }
      ]
    },
    {
      label: 'Help',
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click: function() { require('shell').openExternal('http://electron.atom.io') }
        },
      ]
    },
  ]

  if (process.platform == 'darwin') {
    var name = require('app').getName()
    template.unshift({
      label: name,
      submenu: [
        {
          label: 'About ' + name,
          role: 'about'
        },
        {
          type: 'separator'
        },
        {
          label: 'Services',
          role: 'services',
          submenu: []
        },
        {
          type: 'separator'
        },
        {
          label: 'Hide ' + name,
          accelerator: 'Command+H',
          role: 'hide'
        },
        {
          label: 'Hide Others',
          accelerator: 'Command+Shift+H',
          role: 'hideothers'
        },
        {
          label: 'Show All',
          role: 'unhide'
        },
        {
          type: 'separator'
        },
        {
          label: 'Quit',
          accelerator: 'Command+Q',
          click: function() { app.quit() }
        },
      ]
    })
  }

  var menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

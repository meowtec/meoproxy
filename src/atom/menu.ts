'use strict'

import { Menu, dialog, app } from 'electron'
import caPage from './ca-page'
import * as ip from 'ip'

export default function initMenu() {
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
        }
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
          click: function() {
            require('shell').openExternal('http://electron.atom.io')
          }
        }
      ]
    }
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

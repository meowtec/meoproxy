'use strict'

import { Menu, dialog, shell } from 'electron'
import caPage from './ca-page'
import * as ip from 'ip'

export default function initMenu() {

  const menu = Menu.buildFromTemplate([
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
        {
          label: '刷新',
          accelerator: 'CmdOrCtrl+R',
          click: (item, focusedWindow) => {
            if (focusedWindow) {
              focusedWindow.reload()
            }
          }
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        {
          label: 'Undo',
          accelerator: 'CmdOrCtrl+Z',
          role: 'undo'
        },
        {
          label: 'Redo',
          accelerator: 'Shift+CmdOrCtrl+Z',
          role: 'redo'
        },
        {
          'type': 'separator'
        },
        {
          label: 'Cut',
          accelerator: 'CmdOrCtrl+X',
          role: 'cut'
        },
        {
          label: 'Copy',
          accelerator: 'CmdOrCtrl+C',
          role: 'copy'
        },
        {
          label: 'Paste',
          accelerator: 'CmdOrCtrl+V',
          role: 'paste'
        },
        {
          label: 'Select All',
          accelerator: 'CmdOrCtrl+A',
          role: 'selectall'
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
            shell.openExternal('http://electron.atom.io')
          }
        }
      ]
    }
  ])
  Menu.setApplicationMenu(menu)
}

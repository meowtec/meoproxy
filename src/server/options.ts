'use strict'

import * as fs from 'fs'
import { ipcMain } from 'electron'
import { configBundle } from '../utils/storage'
import { OptionsData, FilterMode, defaultOptionsData } from '../typed/options'
import * as log4js from 'log4js'

const optionFileName = 'settings.json'
const logger = log4js.getLogger('sever/options')

class Options {

  public data: OptionsData

  constructor() {
    this.loadOptions()
    this.listenIpc()
  }

  private listenIpc() {
    ipcMain.on('reload-options', () => {
      this.loadOptions()
    })
  }

  private loadOptions() {
    try {
      this.data = Object.assign({}, defaultOptionsData, JSON.parse(fs.readFileSync(configBundle.path(optionFileName), 'utf-8')))
    } catch (error) {
      if (error.code === 'ENOENT') {
        this.data = defaultOptionsData
        this.saveOptions()
      }
      else {
        throw error
      }
    }
  }

  private saveOptions() {
    fs.writeFile(configBundle.path(optionFileName), JSON.stringify(this.data), (error) => {
      error && logger.error('Options save failed', error)
    })
  }

  private hostInList(host: string, list: Array<string>): boolean {
    return list.some((item) => {
      return item === host || host.endsWith('.' + item)
    })
  }

  private urlInList(url: string, list: Array<string>): boolean {
    return false
  }

  public shouldHttpsInterrupt(hostname) {
    const optionData = this.data

    if (!optionData.httpsEnabled) {
      return false
    }

    return optionData.httpsFilterMode === FilterMode.black ?
      !this.hostInList(hostname, optionData.httpsBlackList) : this.hostInList(hostname, optionData.httpsWhiteList)
  }

  public shouldBreak(uri: string): boolean {
    return this.urlInList(uri, this.data.breakpointList)
  }

}

export default new Options()

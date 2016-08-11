'use strict'

import * as fs from 'fs'
import { ipcMain } from 'electron'
import { configBundle } from '../utils/storage'
import { OptionsData, FilterMode, defaultOptionsData } from '../typed/options'
import { autobind } from '../utils/decorators'
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

  private matchHost(a: string, b: string) {
    if (b.indexOf(':') === -1) {
      a = a.replace(/:\d+$/, '')
    }
    return a === b || a.endsWith('.' + b)
  }

  // host:port, list
  private hostInList(host: string, list: string[]): boolean {
    return list.some((item) => {
      return this.matchHost(host, item)
    })
  }

  private urlInList(url: string, list: string[]): boolean {
    return false
  }

  @autobind
  public shouldHttpsInterrupt(host) {
    const optionData = this.data

    if (!optionData.httpsEnabled) {
      return false
    }

    return optionData.httpsFilterMode === FilterMode.black
      ? !this.hostInList(host, optionData.httpsBlackList)
      : this.hostInList(host, optionData.httpsWhiteList)
  }

  @autobind
  public shouldBreak(uri: string): boolean {
    return this.urlInList(uri, this.data.breakpointList)
  }

}

export default new Options()

'use strict'

export const enum FilterMode {
  black,
  white
}

export interface OptionsData {
  port: number
  httpsEnabled: boolean
  httpsFilterMode: FilterMode
  httpsBlackList: Array<string>
  httpsWhiteList: Array<string>
  breakpointList: Array<string>
}

export const defaultOptionsData: OptionsData = {
  port: 1080,
  httpsEnabled: false,
  httpsFilterMode: FilterMode.white,
  httpsBlackList: [],
  httpsWhiteList: [
    'baidu.com'
  ],
  breakpointList: []
}

'use strict'

export const enum FilterMode {
  black,
  white
}

export interface OptionsData {
  port: number
  httpsEnabled: boolean
  httpsFilterMode: FilterMode
  httpsBlackList: string[]
  httpsWhiteList: string[]
  breakpointList: string[]
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

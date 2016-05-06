'use strict'

import { combineReducers } from 'redux'
import { handleActions } from '../../utils/redux-sweet'
import ActionTypes from '../constants/action-types'
import { configBundle } from '../../utils/storage'
import { OptionsData } from '../../typed/options'

const initialData: OptionsData = JSON.parse(configBundle.read('settings.json').toString())

export const httpsEnabled = handleActions<boolean>({
  [ActionTypes.switchHttps](state) {
    return !state
  }
}, initialData.httpsEnabled)

export const httpsWhiteList = handleActions<string[]>({
  [ActionTypes.updateHttpsWhiteList](state, payload) {
    return payload
  }
}, initialData.httpsWhiteList)

export const httpsBlackList = handleActions<string[]>({
  [ActionTypes.updateHttpsBlackList](state, payload) {
    return payload
  }
}, initialData.httpsBlackList)

export const httpsFilterMode = handleActions<any>({
  [ActionTypes.updateHttpsMode](state, payload) {
    return payload
  }
}, initialData.httpsFilterMode)

export default combineReducers<OptionsData>({
  httpsEnabled,
  httpsWhiteList,
  httpsBlackList,
  httpsFilterMode
})

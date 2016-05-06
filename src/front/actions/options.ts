'use strict'

import { createAction } from '../../utils/redux-sweet'
import ActionTypes from '../constants/action-types'

export const updatePort = createAction(ActionTypes.updatePort)
export const switchHttps = createAction(ActionTypes.switchHttps)
export const updateHttpsMode = createAction(ActionTypes.updateHttpsMode)
export const updateHttpsWhiteList = createAction(ActionTypes.updateHttpsWhiteList)
export const updateHttpsBlackList = createAction(ActionTypes.updateHttpsBlackList)

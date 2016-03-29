'use strict'

export interface Action {
  [key: string]: any
  type: any
  payload: any
}

export interface HandlesMap<T> {
  [key: string]: (state: T, payload, action: Action) => T
}

export function createAction(type, callback: (...args) => any = (x => x)) {
  return (
    (...payload) => ({
      type,
      payload: callback.apply(null, payload)
    })
  )
}

export function handleActions<T>(map: HandlesMap<T>, defaultState: T) {
  return (state: T, action: Action) => {
    let reducer = map[action.type]
    if (reducer) {
      return reducer(state, action.payload, action)
    }
    else if (state === undefined) {
      return defaultState
    }
    else {
      return state
    }
  }
}

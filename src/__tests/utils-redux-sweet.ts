'use strict'

import * as assert from 'assert'
import { createStore, combineReducers } from 'redux'
import { createAction, handleActions } from '../utils/redux-sweet'

describe('createAction', () => {

  it('minimal', () => {
    const action = createAction('a')
    assert.deepEqual(action(), {
      type: 'a',
      payload: undefined
    })
  })

  it('payload', () => {
    const action = createAction('a')
    assert.deepEqual(action(123), {
      type: 'a',
      payload: 123
    })
  })

  it('callback payload', () => {
    const action = createAction('a', (name, age) => ({name, age}))
    assert.deepEqual(action('meowtec', 23), {
      type: 'a',
      payload: {
        name: 'meowtec',
        age: 23
      }
    })
  })

})

describe('handleActions', () => {

  it('test handleActions', () => {
    const addAction = createAction('add')
    const reducer = handleActions({
      add(state, payload, action) {
        return [...state, payload]
      }
    }, [])
    const store = createStore(reducer)

    let step = 0
    store.subscribe(() => {
      if (step === 0) {
        assert.deepEqual(store.getState(), [1])
        step = 1
      }
      else if (step === 1) {
        assert.deepEqual(store.getState(), [1, 2])
      }
    })
    store.dispatch(addAction(1))
    store.dispatch(addAction(2))
  })

  it('test handleActions', () => {
    const addAction = createAction('add')
    const reducer = handleActions({
      add(state, payload, action) {
        return [...state, payload]
      }
    }, [])
    const store = createStore(reducer)

    let step = 0
    store.subscribe(() => {
      if (step === 0) {
        assert.deepEqual(store.getState(), [1])
        step = 1
      }
      else if (step === 1) {
        assert.deepEqual(store.getState(), [1, 2])
      }
    })
    store.dispatch(addAction(1))
    store.dispatch(addAction(2))
  })

  it('test combine handleActions 2', () => {
    const addAction = createAction('add')
    const switchAction = createAction('sw')

    const aReducer = handleActions({
      add(state, payload, action) {
        return [...state, payload]
      }
    }, [])
    const bReducer = handleActions({
      sw(state) {
        return !state
      }
    }, false)
    const reducers = combineReducers({
      list: aReducer,
      open: bReducer
    })

    const store = createStore(reducers)

    let step = 0
    store.subscribe(() => {
      if (step === 0) {
        assert.deepEqual(store.getState(), {
          list: [1],
          open: false
        })
        step = 1
      }
      else if (step === 1) {
        assert.deepEqual(store.getState(), {
          list: [1],
          open: true
        })
      }
    })
    store.dispatch(addAction(1))
    store.dispatch(switchAction())
  })

})

'use strict'

import * as assert from 'assert'
import * as fs from 'fs'
import * as path from 'path'
import options from '../server/options'
import { configBundle } from '../utils/storage'
import { FilterMode, defaultOptionsData } from '../typed/options'

options.data = {
  port: 1089,
  httpsEnabled: false,
  httpsFilterMode: FilterMode.white,
  httpsBlackList: [],
  httpsWhiteList: [],
  breakpointList: []
}

const filePath = path.resolve(configBundle.path('settings.json'))

function readOptions() {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
}

describe('options', () => {
  it('https disabled', () => {
    assert.equal(options.shouldHttpsInterrupt('a.com'), false)
  })

  it('https white list', () => {
    options.data.httpsEnabled = true
    assert.equal(options.shouldHttpsInterrupt('a.com'), false)

    options.data.httpsWhiteList = ['a.com']
    assert.equal(options.shouldHttpsInterrupt('a.com'), true)
    assert.equal(options.shouldHttpsInterrupt('b.a.com'), true)
  })

  it('https black list', () => {
    options.data.httpsFilterMode = FilterMode.black
    assert.equal(options.shouldHttpsInterrupt('a.com'), true)

    options.data.httpsBlackList = ['a.com']
    assert.equal(options.shouldHttpsInterrupt('a.com'), false)
    assert.equal(options.shouldHttpsInterrupt('b.a.com'), false)
  })

  it('saveOptions', (done) => {
    assert.deepEqual(readOptions(), defaultOptionsData)
    options['saveOptions']()
    setTimeout(() => {
      assert.deepEqual(readOptions(), options.data)
      done()
    }, 50)
  })

  it('loadOptions', () => {
    const testData = {
      httpsBlackList: ['a.b', 'b.c'],
      httpsWhiteList: ['d'],
    }
    fs.writeFileSync(filePath, JSON.stringify(testData))
    options['loadOptions']()
    assert.deepEqual(options.data, Object.assign({}, defaultOptionsData, testData))
  })
})

'use strict'

import * as assert from 'assert'
import { parse, stringify } from '../utils/headers'
import { trimIndent } from '../utils/utils'
import { Headers } from '../typed/typed'

describe('headers', () => {

  const rawHeaders = trimIndent(
    `
    Header-X: 1
    Header-Y: 2
    Header-Z: 3
    `
  )

  const headers: Headers = {
    'Header-X': '1',
    'Header-Y': '2',
    'Header-Z': '3'
  }

  it('headers.parse', () => {
    assert.deepEqual(parse(rawHeaders), headers)
  })

  it('headers.stringify', () => {
    assert.equal(stringify(headers), rawHeaders)
  })

})

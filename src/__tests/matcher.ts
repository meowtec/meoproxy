'use strict'

import * as assert from 'assert'
import Matcher from '../utils/matcher'

describe('matcher', () => {
  it('test matcher', () => {
    const matcher = new Matcher('*.sample.com')
    assert.equal(matcher['regexp'].toString(), '/^.*\\.sample\\.com$/')
    assert.ok(matcher.test('www.sample.com'))
  })
})

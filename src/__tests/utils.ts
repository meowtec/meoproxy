'use strict'

import * as assert from 'assert'

import * as _ from '../utils/utils'

describe('utils', () => {

  it('should uuid be unique', () => {
    assert.notEqual(_.id(), _.id())
  })

  it('genUrl', () => {
    assert.equal(_.genUrl('http', '127.0.0.1', '1080', '/path/to'), 'http://127.0.0.1:1080/path/to')
    assert.equal(_.genUrl('http', '127.0.0.1', '80', '/path/to'), 'http://127.0.0.1/path/to')
    assert.equal(_.genUrl('https', '127.0.0.1', '', '/path/to'), 'https://127.0.0.1/path/to')
  })

  it('parseQS', () => {
    assert.deepEqual(_.parseQS('ab=a%20%26%20b&x%3Dy=x%3Dy&z=3'), {
      ab: 'a & b',
      'x=y': 'x=y',
      z: '3'
    })

    assert.deepEqual(_.parseQS('ab=a%20%26%20b&z&c='), {
      ab: 'a & b',
      z: '',
      c: ''
    })
  })

  it('toString', () => {
    assert.equal(_.toString(null), '')
    assert.equal(_.toString(undefined), '')
    assert.equal(_.toString(1), '1')
    assert.equal(_.toString('x'), 'x')
    assert.equal(_.toString(true), 'true')
  })

  it('trimIndent', () => {
    assert.equal(_.trimIndent(
      `
      line 1
      line 2
      line 3
      `
    ), 'line 1\nline 2\nline 3')

    assert.equal(_.trimIndent(
      `
      line 1
      line 2
      line 3

      `
    ), 'line 1\nline 2\nline 3\n')

    assert.equal(_.trimIndent('x\n'), 'x\n')
  })
})

'use strict'

import * as assert from 'assert'
import * as contentType from '../utils/content-type'

describe('text type', () => {

  it('should be text file', () => {
    assert.ok(contentType.isText('text/my-type'), 'text/my-type is text file')
    assert.ok(contentType.isText('application/javascript'), 'application/javascript is text file')
  })

  it('should not be text file', () => {
    assert.equal(false, contentType.isText('image/png'), 'image/png is not text file')
  })

})

describe('charset', () => {

  it('should be correct charset', () => {
    assert.equal(contentType.detectEncode('text/html; charset=utf-8'), 'utf-8', '`text/html; charset=utf-8` is utf-8')
    assert.equal(contentType.detectEncode('text/html;charset=gbk'), 'gbk', '`text/html; charset=utf-8` is utf-8')
  })

})

var chai = require('chai')
var assert = chai.assert

var contentType = require('../../lib/utils/content-type')

describe('text type', function() {
  it('should be text file', function() {
    assert.ok(contentType.isText('text/my-type'), 'text/my-type is text file')
    assert.ok(contentType.isText('application/javascript'), 'application/javascript is text file')
  })

  it('should not be text file', function() {
    assert.notOk(contentType.isText('image/png'), 'image/png is not text file')
  })
})

describe('charset', function() {
  it('should be correct charset', function() {
    assert.equal(contentType.detectEncode('text/html; charset=utf-8'), 'utf-8', '`text/html; charset=utf-8` is utf-8')
    assert.equal(contentType.detectEncode('text/html;charset=gbk'), 'gbk', '`text/html; charset=utf-8` is utf-8')
  })
})

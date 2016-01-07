var chai = require('chai')
var assert = chai.assert
var EventEmitter = require('events')
var utils = require('../../lib/utils/utils')

describe('utils', function() {

  describe('#emitterPromisify', function() {
    it('should return a new promise. and the promise will resolve when the `eventName` is emit', function(done) {
      var event = new EventEmitter()
      var v1 = 123
      var v2 = 345
      utils.emitterPromisify(event, 'ttt').then(function(value) {
        assert.equal(value, v1)
        done()
      })
      utils.emitterPromisify(event, 'kkk').then(function(value) {
        assert.equal(value, v2)
        done()
      })
      event.emit('ttt', v1)
      setTimeout(function() {
        event.emit('kkk', v2)
      }, 100)
    })
  })

})

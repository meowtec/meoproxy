var chai = require('chai')
var assert = chai.assert
var EventEmitter = require('events')
var utils = require('../../lib/utils/utils')

describe('utils', function() {

  describe('#debounce', function() {
    var genDebouncedCase = function(dynamic) {
      return function(done) {
        var records = []
        var globalTest = 0

        var rawFun = function() {
          records.push(globalTest)
        }

        var fun
        if (dynamic) {
          fun = utils.debounce(20)
        }
        else {
          fun = utils.debounce(rawFun, 20)
        }

        var runTest = function(time, test) {
          setTimeout(function() {
            globalTest = test

            if (dynamic) {
              fun(rawFun)
            }
            else {
              fun()
            }
          }, time)
        }

        runTest(0, 1)
        runTest(30, 2)
        runTest(40, 3)
        runTest(70, 4)

        setTimeout(() => {
          assert.deepEqual(records, [1, 3, 4])
          done()
        }, 100)
      }
    }

    it('should work with a initial fun', genDebouncedCase())

    // copy from the prev case, some differences
    it('should work with a dynamic fun', genDebouncedCase(true))
  })

  describe('#parseHost', function() {
    it('should return correct result', function() {
      assert.deepEqual(utils.parseHost('127.0.0.1:8089'), {
        host: '127.0.0.1',
        port: 8089
      })
      assert.deepEqual(utils.parseHost('127.0.0.1'), {
        host: '127.0.0.1',
        port: 80
      })
    })
  })

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

  // TODO
  // #streamReadAll
})

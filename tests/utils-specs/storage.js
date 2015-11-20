var chai = require('chai')
var assert = chai.assert

var storage = require('../../lib/utils/storage')

describe('storage', function() {
  it('should uuid be unique', function() {
    assert.notEqual(storage.uuid(), storage.uuid())
  })

  it('should storage generator correct file path', function() {
    assert.equal(storage.filePath('filename', 'tag1', 'tag2'), 'filename.tag1.tag2')
  })

  var uuid = storage.uuid()
  var textData = uuid + 'test!'

  it('should writeStream and readStream work', function(done) {
    var writeStream = storage.writeStream(uuid)

    writeStream.end(textData, () => {
      var readStream = storage.readStream(uuid)

      readStream.on('data', data => {
        assert.equal(textData, data.toString(), 'write-data equals read-data')
        done()
      })
    })
  })

  it('should storage.readFileSync work', function() {
    assert.equal(storage.readFile(uuid).toString(), textData)
  })
})

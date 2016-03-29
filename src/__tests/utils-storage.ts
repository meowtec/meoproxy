'use strict'

import * as assert from 'assert'

import * as _ from '../utils/utils'
import * as storage from '../utils/storage'

describe('storage', () => {

  it('should storage generator correct file path', () => {
    assert.equal(storage.filePath('filename', 'tag1', 'tag2'), 'filename.tag1.tag2')
  })

  const uuid = _.id()
  const textData = uuid + 'test!'

  it('should writeStream and readStream work', (done) => {
    const writeStream = storage.writeStream(uuid)

    writeStream.end(textData, () => {
      const readStream = storage.readStream(uuid)

      readStream.on('data', data => {
        assert.equal(textData, data.toString(), 'write-data equals read-data')
        done()
      })
    })
  })

  it('should storage.readFileSync work', () => {
    assert.equal(storage.readFile(uuid).toString(), textData)
  })
})

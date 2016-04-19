'use strict'

import * as assert from 'assert'

import * as _ from '../utils/utils'
import { cacheBundle } from '../utils/storage'

describe('storage', () => {

  const uuid = _.id()
  const textData = uuid + 'test!'

  it('should writeStream and readStream work', (done) => {
    const writeStream = cacheBundle.writeStream(uuid)

    writeStream.end(textData, () => {
      const readStream = cacheBundle.readStream(uuid)

      readStream.on('data', data => {
        assert.equal(textData, data.toString(), 'write-data equals read-data')
        done()
      })
    })
  })

  it('should storage.readFileSync work', () => {
    assert.equal(cacheBundle.read(uuid).toString(), textData)
  })
})

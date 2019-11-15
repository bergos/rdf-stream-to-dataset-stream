const assert = require('assert')
const getStream = require('get-stream')
const toDatasetStream = require('../toDatasetStream')
const { isDuplex } = require('isstream')
const { describe, it } = require('mocha')
const namespace = require('@rdfjs/namespace')
const rdf = require('@rdfjs/data-model')

const ns = {
  example: namespace('http://example.org/')
}

describe('toDatasetStream', () => {
  it('should be a function', () => {
    assert.strictEqual(typeof toDatasetStream, 'function')
  })

  it('should return a duplex stream', () => {
    const stream = toDatasetStream()

    assert(isDuplex(stream))
  })

  it('should emit no chunks if there are no input chunks', async () => {
    const stream = toDatasetStream()

    stream.end()

    const result = await getStream.array(stream)

    assert.deepStrictEqual(result, [])
  })

  it('should combine all quads to one dataset', async () => {
    const quad0 = rdf.quad(ns.example.subject0, ns.example.predicate, ns.example.object0, ns.example.graph)
    const quad1 = rdf.quad(ns.example.subject1, ns.example.predicate, ns.example.object1, ns.example.graph)
    const stream = toDatasetStream()

    stream.write(quad0)
    stream.write(quad1)
    stream.end()

    const result = await getStream.array(stream)

    assert.strictEqual(result.length, 1)
    assert(result[0].has(quad0))
    assert(result[0].has(quad1))
  })
})

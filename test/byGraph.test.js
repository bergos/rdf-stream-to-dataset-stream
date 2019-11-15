const assert = require('assert')
const getStream = require('get-stream')
const byGraph = require('../byGraph')
const { isDuplex } = require('isstream')
const { describe, it } = require('mocha')
const namespace = require('@rdfjs/namespace')
const rdf = require('@rdfjs/data-model')

const ns = {
  example: namespace('http://example.org/')
}

describe('byGraph', () => {
  it('should be a function', () => {
    assert.strictEqual(typeof byGraph, 'function')
  })

  it('should return a duplex stream', () => {
    const stream = byGraph()

    assert(isDuplex(stream))
  })

  it('should emit no chunks if there are no input chunks', async () => {
    const stream = byGraph()

    stream.end()

    const result = await getStream.array(stream)

    assert.deepStrictEqual(result, [])
  })

  it('should combine all quads to one dataset if all are in the same graph', async () => {
    const quad0 = rdf.quad(ns.example.subject0, ns.example.predicate, ns.example.object0, ns.example.graph)
    const quad1 = rdf.quad(ns.example.subject1, ns.example.predicate, ns.example.object1, ns.example.graph)
    const stream = byGraph()

    stream.write(quad0)
    stream.write(quad1)
    stream.end()

    const result = await getStream.array(stream)

    assert.strictEqual(result.length, 1)
    assert(result[0].has(quad0))
    assert(result[0].has(quad1))
  })

  it('should split quads by graph', async () => {
    const quad0 = rdf.quad(ns.example.subject0, ns.example.predicate, ns.example.object0, ns.example.graph0)
    const quad1 = rdf.quad(ns.example.subject1, ns.example.predicate, ns.example.object1, ns.example.graph0)
    const quad2 = rdf.quad(ns.example.subject0, ns.example.predicate, ns.example.object0, ns.example.graph1)
    const quad3 = rdf.quad(ns.example.subject1, ns.example.predicate, ns.example.object1, ns.example.graph1)
    const stream = byGraph()

    stream.write(quad0)
    stream.write(quad1)
    stream.write(quad2)
    stream.write(quad3)
    stream.end()

    const result = await getStream.array(stream)

    assert.strictEqual(result.length, 2)
    assert(result[0].has(quad0))
    assert(result[0].has(quad1))
    assert(result[1].has(quad2))
    assert(result[1].has(quad3))
  })
})

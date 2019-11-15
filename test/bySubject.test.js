const assert = require('assert')
const getStream = require('get-stream')
const bySubject = require('../bySubject')
const { isDuplex } = require('isstream')
const { describe, it } = require('mocha')
const namespace = require('@rdfjs/namespace')
const rdf = require('@rdfjs/data-model')

const ns = {
  example: namespace('http://example.org/')
}

describe('bySubject', () => {
  it('should be a function', () => {
    assert.strictEqual(typeof bySubject, 'function')
  })

  it('should return a duplex stream', () => {
    const stream = bySubject()

    assert(isDuplex(stream))
  })

  it('should emit no chunks if there are no input chunks', async () => {
    const stream = bySubject()

    stream.end()

    const result = await getStream.array(stream)

    assert.deepStrictEqual(result, [])
  })

  it('should combine all quads to one dataset if all of them have the same subject', async () => {
    const quad0 = rdf.quad(ns.example.subject, ns.example.predicate, ns.example.object0)
    const quad1 = rdf.quad(ns.example.subject, ns.example.predicate, ns.example.object1)
    const stream = bySubject()

    stream.write(quad0)
    stream.write(quad1)
    stream.end()

    const result = await getStream.array(stream)

    assert.strictEqual(result.length, 1)
    assert(result[0].has(quad0))
    assert(result[0].has(quad1))
  })

  it('should combine all quads to one dataset if all of them have the same named node subject', async () => {
    const blankNode = rdf.blankNode()
    const quad0 = rdf.quad(ns.example.subject, ns.example.predicate, blankNode)
    const quad1 = rdf.quad(blankNode, ns.example.predicate, ns.example.object0)
    const quad2 = rdf.quad(blankNode, ns.example.predicate, ns.example.object1)
    const quad3 = rdf.quad(ns.example.subject, ns.example.predicate, ns.example.object2)
    const stream = bySubject()

    stream.write(quad0)
    stream.write(quad1)
    stream.write(quad2)
    stream.write(quad3)
    stream.end()

    const result = await getStream.array(stream)

    assert.strictEqual(result.length, 1)
    assert(result[0].has(quad0))
    assert(result[0].has(quad1))
    assert(result[0].has(quad2))
    assert(result[0].has(quad3))
  })

  it('should split quads by subject', async () => {
    const quad0 = rdf.quad(ns.example.subject0, ns.example.predicate, ns.example.object0)
    const quad1 = rdf.quad(ns.example.subject0, ns.example.predicate, ns.example.object1)
    const quad2 = rdf.quad(ns.example.subject1, ns.example.predicate, ns.example.object0)
    const quad3 = rdf.quad(ns.example.subject1, ns.example.predicate, ns.example.object1)
    const stream = bySubject()

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

  it('should split quads by named node subject', async () => {
    const blankNode0 = rdf.blankNode()
    const quad0 = rdf.quad(ns.example.subject0, ns.example.predicate, blankNode0)
    const quad1 = rdf.quad(blankNode0, ns.example.predicate, ns.example.object0)
    const quad2 = rdf.quad(ns.example.subject0, ns.example.predicate, ns.example.object1)
    const blankNode1 = rdf.blankNode()
    const quad3 = rdf.quad(ns.example.subject1, ns.example.predicate, blankNode1)
    const quad4 = rdf.quad(blankNode1, ns.example.predicate, ns.example.object0)
    const quad5 = rdf.quad(ns.example.subject1, ns.example.predicate, ns.example.object1)
    const stream = bySubject()

    stream.write(quad0)
    stream.write(quad1)
    stream.write(quad2)
    stream.write(quad3)
    stream.write(quad4)
    stream.write(quad5)
    stream.end()

    const result = await getStream.array(stream)

    assert.strictEqual(result.length, 2)
    assert(result[0].has(quad0))
    assert(result[0].has(quad1))
    assert(result[0].has(quad2))
    assert(result[1].has(quad3))
    assert(result[1].has(quad4))
    assert(result[1].has(quad5))
  })
})

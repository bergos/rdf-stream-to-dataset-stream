const assert = require('assert')
const getStream = require('get-stream')
const byType = require('../byType')
const { isDuplex } = require('isstream')
const { describe, it } = require('mocha')
const namespace = require('@rdfjs/namespace')
const rdf = require('@rdfjs/data-model')

const ns = {
  example: namespace('http://example.org/'),
  rdf: namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#')
}

describe('byType', () => {
  it('should be a function', () => {
    assert.strictEqual(typeof byType, 'function')
  })

  it('should throw an error if no type is given', () => {
    assert.throws(() => {
      byType()
    }, new RegExp('required'))
  })

  it('should return a duplex stream', () => {
    const stream = byType(ns.example.type)

    assert(isDuplex(stream))
  })

  it('should emit no chunks if there are no input chunks', async () => {
    const stream = byType(ns.example.type)

    stream.end()

    const result = await getStream.array(stream)

    assert.deepStrictEqual(result, [])
  })

  it('should combine all quads to one dataset if the given type doesn\'t show up', async () => {
    const quad0 = rdf.quad(ns.example.subject, ns.example.predicate, ns.example.object0)
    const quad1 = rdf.quad(ns.example.subject, ns.example.predicate, ns.example.object1)
    const stream = byType(ns.example.predicate0)

    stream.write(quad0)
    stream.write(quad1)
    stream.end()

    const result = await getStream.array(stream)

    assert.strictEqual(result.length, 1)
    assert(result[0].has(quad0))
    assert(result[0].has(quad1))
  })

  it('should combine all quads to one dataset if only the first quad has the given type', async () => {
    const quad0 = rdf.quad(ns.example.subject, ns.rdf.type, ns.example.type)
    const quad1 = rdf.quad(ns.example.subject, ns.example.predicate, ns.example.object)
    const stream = byType(ns.example.type)

    stream.write(quad0)
    stream.write(quad1)
    stream.end()

    const result = await getStream.array(stream)

    assert.strictEqual(result.length, 1)
    assert(result[0].has(quad0))
    assert(result[0].has(quad1))
  })

  it('should split quads by the given type', async () => {
    const quad0 = rdf.quad(ns.example.subject0, ns.rdf.type, ns.example.type)
    const quad1 = rdf.quad(ns.example.subject1, ns.example.predicate, ns.example.object1)
    const quad2 = rdf.quad(ns.example.subject2, ns.rdf.type, ns.example.type)
    const quad3 = rdf.quad(ns.example.subject3, ns.example.predicate, ns.example.object3)
    const stream = byType(ns.example.type)

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

  it('should split quads by the given type string', async () => {
    const quad0 = rdf.quad(ns.example.subject0, ns.rdf.type, ns.example.type)
    const quad1 = rdf.quad(ns.example.subject1, ns.example.predicate, ns.example.object1)
    const quad2 = rdf.quad(ns.example.subject2, ns.rdf.type, ns.example.type)
    const quad3 = rdf.quad(ns.example.subject3, ns.example.predicate, ns.example.object3)
    const stream = byType(ns.example.type.value)

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

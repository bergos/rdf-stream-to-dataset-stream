const rdf = require('@rdfjs/data-model')
const toDatasetStream = require('./toDatasetStream')

const rdfType = rdf.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type')

function byType (type) {
  if (!type) {
    throw new Error('type is a required argument')
  }

  if (typeof type === 'string') {
    type = rdf.namedNode(type)
  }

  return toDatasetStream({
    split: current => current.predicate.equals(rdfType) && current.object.equals(type)
  })
}

module.exports = byType

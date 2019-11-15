const rdf = require('@rdfjs/data-model')
const toDatasetStream = require('./toDatasetStream')

function byPredicate (predicate) {
  if (!predicate) {
    throw new Error('predicate is a required argument')
  }

  if (typeof predicate === 'string') {
    predicate = rdf.namedNode(predicate)
  }

  return toDatasetStream({
    split: current => current.predicate.equals(predicate)
  })
}

module.exports = byPredicate

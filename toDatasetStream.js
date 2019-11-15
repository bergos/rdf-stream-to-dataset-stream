const chunkify = require('chunkify-stream')
const rdf = require('@rdfjs/dataset')

function toDatasetStream ({ split } = {}) {
  return chunkify({
    combine: quads => rdf.dataset(quads),
    split
  })
}

module.exports = toDatasetStream

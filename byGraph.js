const toDatasetStream = require('./toDatasetStream')

function byGraph () {
  return toDatasetStream({
    split: (current, last) => !current.graph.equals(last.graph)
  })
}

module.exports = byGraph

const toDatasetStream = require('./toDatasetStream')

function bySubject () {
  let lastNamedNode = null

  return toDatasetStream({
    split: (current, last) => {
      lastNamedNode = last.subject.termType === 'NamedNode' ? last.subject : lastNamedNode

      if (current.subject.termType !== 'NamedNode') {
        return false
      }

      if (!lastNamedNode) {
        return false
      }

      return !current.subject.equals(lastNamedNode)
    }
  })
}

module.exports = bySubject

const { createReadStream } = require('fs')
const bySubject = require('../bySubject')
const N3Parser = require('@rdfjs/parser-n3')

const filename = require.resolve('tbbt-ld/dist/tbbt.nt')
const input = createReadStream(filename)
const quadStream = (new N3Parser()).import(input)
const split = bySubject()

quadStream.pipe(split)

split.on('data', dataset => {
  console.log(`dataset size: ${dataset.size}`)

  for (const quad of dataset) {
    console.log(`${quad.subject.value} ${quad.predicate.value} ${quad.object.value}`)
  }
})

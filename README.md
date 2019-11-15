# rdf-stream-to-dataset-stream

`rdf-stream-to-dataset-stream` combines a quad stream to dataset chunks.


## Usage

### byGraph()

Combines all consecutive quads that have the same named graph to a dataset.

### byPredicate(predicate)

For use cases where the predicate is the separator.
Combines all consecutive quads to a dataset until the given predicate shows up.
The quad with the given predicate will be the first quad of the dataset.
Quads that show up before the first appearance of the predicate will be combined to the first dataset.
The `predicate` argument can be a RDF/JS `NamedNode` or a `string`.

### bySubject()

Combines all consecutive quads that belong to the same named node subject to a dataset.
There is no check if blank node subjects belong to a tree structure of the last named node subject.

### byType(type)

For use cases where the rdf type is the separator.
Combines all consecutive quads to a dataset until the given type shows up.
The quad with the given type will be the first quad of the dataset.
Quads that show up before the first appearance of the type will be combined to the first dataset.
The `type` argument can be a RDF/JS `NamedNode` or a `string`.

### toDatasetStream({ split } = {})

Combines all consecutive quads to a dataset until the split function returns `true`.
If no `split` function is provided, a function that always returns `false` is used.  
The `split` function will be called with the following arguments:

```js
  split(current, last, all)
```

- `current` is the current quad in the stream, which is not yet added to the dataset.
- `last` is the previous quad in the stream.
- `all` are all quads belonging to the next dataset chunk in an `Array`.

## Example

The example `tbbtBySubject.js` shows how to use `bySubject` to combine the quads of a N3 parser stream.

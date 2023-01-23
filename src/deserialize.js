import * as Y from 'yjs'
import fromPairs from 'lodash/fromPairs.js'

// Convert typed JSON to Yjs object and/or POJO
const deserialize = ([type, value]) => {
  switch (type) {
    case 'string':
    case 'number':
    case 'boolean':
    case 'null':
      return value
    case 'YText':
      return new Y.Text(value)
    case 'array':
      return value.map(deserialize)
    case 'YArray':
      return Y.Array.from(value.map(deserialize))
    case 'object':
      return fromPairs(deserializeChildren(value))
    case 'YMap':
      return new Y.Map(deserializeChildren(value))
    default:
      return undefined
  }
}

const deserializeChildren = (children) =>
  Object.entries(children).map(([k, v]) => [k, deserialize(v)])

export default deserialize

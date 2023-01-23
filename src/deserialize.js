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
    case 'object':
      return fromPairs(
        Object.entries(value).map(([k, v]) => [k, deserialize(v)])
      )
    case 'array':
      return value.map(deserialize)
    case 'YText':
      return new Y.Text(value)
    case 'YMap':
      return new Y.Map(
        Object.entries(value).map(([k, v]) => [k, deserialize(v)])
      )
    case 'YArray':
      return Y.Array.from(value.map(deserialize))
    default:
      return undefined
  }
}

export default deserialize

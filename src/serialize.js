import * as Y from 'yjs'

// Get type string of Yjs object or POJO
const getType = (o) => {
  if (o instanceof Y.XmlText) return 'YXmlText'
  if (o instanceof Y.XmlElement) return 'YXmlElement'
  if (o instanceof Y.XmlFragment) return 'YXmlFragment'
  if (o instanceof Y.Map) return 'YMap'
  if (o instanceof Y.Array) return 'YArray'
  if (o instanceof Y.Text) return 'YText'
  if (Array.isArray(o)) return 'array'
  if (o === null) return 'null'
  return typeof o
}

// Convert Yjs object and/or POJO to typed JSON
const serialize = (v) => {
  const type = getType(v)
  const value = (() => {
    if (type === 'YMap') {
      const map = {}
      v.forEach((value, key) => {
        map[key] = serialize(value)
      })
      return map
    } else if (type === 'object') {
      return Object.entries(v).reduce((acc, [key, value]) => {
        acc[key] = serialize(value)
        return acc
      }, {})
    } else if (type === 'YArray' || type === 'array') {
      return v.map(serialize)
    } else if (
      type === 'XmlFragment' ||
      type === 'XmlElement' ||
      type === 'XmlText'
    ) {
      throw new Error('Not implemented yet') // https://github.com/probability-nz/immer-yjs-typed/issues/2
    } else {
      return v?.toJSON ? v.toJSON() : v
    }
  })()
  return [type, value]
}

export { getType }
export default serialize

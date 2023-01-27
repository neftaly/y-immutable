import * as Y from 'yjs'
import { YOrJSON, TypedJSON, TypedJSONType } from './types'

// Get type of Yjs object or POJO
const getType = (object: YOrJSON): TypedJSONType => {
  if (object instanceof Y.XmlText) return 'YXmlText'
  if (object instanceof Y.XmlElement) return 'YXmlElement'
  if (object instanceof Y.XmlFragment) return 'YXmlFragment'
  if (object instanceof Y.Map) return 'YMap'
  if (object instanceof Y.Array) return 'YArray'
  if (object instanceof Y.Text) return 'YText'
  if (Array.isArray(object)) return 'array'
  if (object === null) return 'null'
  return typeof object as TypedJSONType
}

// Convert Yjs objects and POJOs to typed JSON
const serialize = (object: YOrJSON): TypedJSON => {
  const type = getType(object)
  const value = (() => {
    if (type === 'YMap') {
      const map = {}
      ;(object as Y.Map<YOrJSON>).forEach((value, key) => {
        map[key] = serialize(value)
      })
      return map
    } else if (type === 'object') {
      return Object.entries(object as Object).reduce((acc, [key, value]) => {
        acc[key] = serialize(value)
        return acc
      }, {})
    } else if (type === 'YArray' || type === 'array') {
      return (object as Y.Array<YOrJSON> | Array<YOrJSON>).map(serialize)
    } else if (
      type === 'YXmlFragment' ||
      type === 'YXmlElement' ||
      type === 'YXmlText'
    ) {
      throw new Error('Not implemented yet') // https://github.com/probability-nz/y-immutable/issues/2
    } else {
      return typeof (object as any)?.toJSON === 'function'
        ? (object as any).toJSON()
        : object
    }
  })()
  return [type, value]
}

export { getType }
export default serialize

import * as Y from 'yjs'

export type JSONPrimitive = string | number | boolean | null
export type JSONValue = JSONPrimitive | JSONObject | JSONArray
export type JSONObject = { [member: string]: JSONValue }
export interface JSONArray extends Array<JSONValue> {}

export type YOrJSON = YValue | JSONValue
export type YValue =
  | Y.Map<any>
  | Y.Array<any>
  | Y.Text
  | Y.XmlText
  | Y.XmlElement
  | Y.XmlFragment

export type TypedJSONType =
  | 'YMap'
  | 'object'
  | 'YArray'
  | 'array'
  | 'null'
  | 'string'
  | 'number'
  | 'boolean'
  | 'YText'
  | 'YXmlText'
  | 'YXmlElement'
  | 'YXmlFragment'

// TODO: Add nesting/recursion to array/object/YArray/YMap
export type TypedJSON =
  | ['YMap', object]
  | ['object', object]
  | ['YArray', JSONArray]
  | ['array', JSONArray]
  | ['null', null]
  | ['string', string]
  | ['number', number]
  | ['boolean', boolean]
  | ['YText', string]
  | ['YXmlText', object]
  | ['YXmlElement', object]
  | ['YXmlFragment', object]

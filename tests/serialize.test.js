import { assert, test } from 'vitest'
import * as Y from 'yjs'
import serialize, { getType } from '../src/serialize'
import { generateTestYData, generateTestJson } from './testdata'

test('getType', () => {
  assert.equal(getType(new Y.Map()), 'YMap')
  assert.equal(getType(new Y.Array()), 'YArray')
  assert.equal(getType(new Y.Text()), 'YText')
  assert.equal(getType(new Y.XmlFragment()), 'YXmlFragment')
  assert.equal(getType(new Y.XmlElement()), 'YXmlElement')
  assert.equal(getType(new Y.XmlText()), 'YXmlText')
  assert.equal(getType(null), 'null')
  assert.equal(getType([]), 'array')
  assert.equal(getType({}), 'object')
  assert.equal(getType(''), 'string')
  assert.equal(getType(0), 'number')
  assert.equal(getType(false), 'boolean')
})

test.todo('serialize XmlFragment/XmlElement/XmlText') // https://github.com/probability-nz/immer-yjs-typed/issues/2
test('serialize', () => {
  const expect = generateTestJson()
  const testYMap = generateTestYData()
  const result = serialize(testYMap)
  assert.deepEqual(result, expect, 'converts Y tree to typed JSON')
})

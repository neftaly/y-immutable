import { assert, test } from 'vitest'
import deserialize from '../src/deserialize'
import { generateTestJson } from './testdata'
import * as Y from 'yjs'
import { isPlainObject } from 'lodash'
import serialize from '../src/serialize'

test.todo('deserialize XmlFragment/XmlElement/XmlText') // https://github.com/probability-nz/immer-yjs-typed/issues/2
test('deserialize', () => {
  const testJson = generateTestJson()
  const result = deserialize(testJson)

  // Attach result to a Y.Doc so that its contents update
  new Y.Doc().getMap('testroot').set('test', result)

  // Check Y object is correct
  assert.isTrue(result instanceof Y.Map)
  assert.equal(result.get('testnull'), null)
  assert.isTrue(isPlainObject(result.get('testobject')))
  assert.deepEqual(result.get('testobject'), { a: 'aaa' })
  assert.isTrue(Array.isArray(result.get('testarray')))
  assert.deepEqual(result.get('testarray'), [0])
  assert.equal(result.get('testboolean'), false)
  assert.equal(result.get('teststring'), 'hello')
  assert.equal(result.get('testnumber'), 0)
  assert.isTrue(result.get('testYText') instanceof Y.Text)
  assert.equal(result.get('testYText').toJSON(), 'hey')
  assert.isTrue(result.get('testYMap') instanceof Y.Map)
  assert.deepEqual(result.get('testYMap').toJSON(), { testnumber: 0 })
  assert.isTrue(result.get('testYArray') instanceof Y.Array)
  assert.deepEqual(result.get('testYArray').toJSON(), [5, 0, 7])

  // We can also use toMarshalledJS to check the result
  const resultJson = serialize(result)
  assert.deepEqual(resultJson, testJson, 'converts typed JSON to Y tree')
})

import { assert, test } from 'vitest'
import * as Y from 'yjs'
import bind, { serialize, deserialize } from '../src/index.js'
import seralizeFunction from '../src/serialize'
import deseralizeFunction from '../src/deserialize'
import { generateTestYData, generateTestJson } from './testdata'

test('exports serialize & deserialize', () => {
  assert.equal(serialize, seralizeFunction)
  assert.equal(deserialize, deseralizeFunction)
})

test.todo('Update individual characters in YText')

test('bind usage demo', () => {
  // Set up Yjs
  const doc = new Y.Doc()
  const map = doc.getMap('map')

  // Connect y-immutable
  const binder = bind(map)

  // Set initial data
  const initialData = generateTestJson()
  binder.update(() => initialData)

  assert.equal(
    binder.get(),
    binder.get(),
    'snapshot reference should not change if no update'
  )

  // get current state as snapshot
  const snapshot1 = binder.get()

  assert.deepEqual(
    snapshot1,
    initialData,
    'should equal to initial structurally'
  )

  assert.deepEqual(
    generateTestYData().toJSON(),
    map.toJSON(),
    'should equal to yjs structurally'
  )

  // update the state with immer
  binder.update((state) => {
    state[1].teststring[1] = 'there'
    // state[1].teststring[0] = 'YText' // TODO: test changing type
    state[1].testYArray[1].push(['number', 9])
    delete state[1].testYMap[1].testnumber
  })

  // get snapshot after modification
  const snapshot2 = binder.get()

  assert.deepEqual(snapshot1, initialData, 'snapshot1 unchanged')
  assert.notEqual(snapshot1, snapshot2, 'snapshot2 changed')

  assert.equal(snapshot2[1].teststring[1], 'there', 'strings can be changed')

  assert.deepEqual(
    snapshot2[1].testYArray[1][3],
    ['number', 9],
    'items can be added to YArrays'
  )

  assert.deepEqual(
    snapshot2[1].testYMap[1],
    {},
    'keys can be deleted from YMaps'
  )

  /*
  expect(snapshot2[id1].topping.find((x) => x.id === '9999')).toStrictEqual({ id: '9999', type: 'test3' })
  expect(snapshot2[id3]).toBeUndefined()

  // reference changed as well
  expect(snapshot2[id1]).not.toBe(snapshot1[id1])

  // unchanged properties should keep referential equality with previous snapshot
  expect(snapshot2[id2]).toBe(snapshot1[id2])
  expect(snapshot2[id1].batters).toBe(snapshot1[id1].batters)
  expect(snapshot2[id1].topping[0]).toBe(snapshot1[id1].topping[0])

  // the underlying yjs data type reflect changes as well
  expect(map.toJSON()).toStrictEqual(snapshot2)

  // but yjs data type should not change reference (they are mutated in-place whenever possible)
  expect(map).toBe(doc.getMap(topLevelMap))
  expect(map.get(id1)).toBe(yd1)
  expect((map.get(id1) as any).get('topping')).toBe(yd1.get('topping'))

  // save the length for later comparison
  const expectLength = binder.get()[id1].batters.batter.length

  // change from y.js
  yd1.get('batters')
      .get('batter')
      .push([{ id: '1005', type: 'test' }])

  // change reflected in snapshot
  expect(binder.get()[id1].batters.batter.at(-1)).toStrictEqual({ id: '1005', type: 'test' })

  // now the length + 1
  expect(binder.get()[id1].batters.batter.length).toBe(expectLength + 1)

  // delete something from yjs
  yd1.delete('topping')

  // deletion reflected in snapshot
  expect(binder.get()[id1].topping).toBeUndefined()

  // release the observer, so the CRDT type can be bind again
  binder.unbind()
*/
})

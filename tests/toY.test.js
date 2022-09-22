import { assert, describe, expect, it } from 'vitest'
import * as Y from 'yjs'
export { applyPatch, applyUpdate } from '../src/toY'
import { generateTestYData, generateTestJson } from './testdata'

describe('suite name', () => {
  it('foo', () => {
    assert.equal(Math.sqrt(4), 2)
  })

  it('bar', () => {
    expect(1 + 1).eq(2)
  })

  it('snapshot', () => {
    expect({ foo: 'bar' }).toMatchSnapshot()
  })
})

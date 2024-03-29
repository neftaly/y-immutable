import { enablePatches, produceWithPatches } from 'immer'
import * as Y from 'yjs'
import deserialize from './deserialize'
import { get, initial, last } from 'lodash'
import { getType } from './serialize'

enablePatches()

const updateY = (root, { path, op, value = [] }, snapshot) => {
  if (!path.length) {
    const [type, actualValue] = value
    const oldType = getType(root)
    if (op !== 'replace') throw new Error('Not implemented')
    if (type === oldType) {
      switch (type) {
        case 'YMap':
          root.clear()
          Object.entries(actualValue).forEach(
            ([k, v]) => void root.set(k, deserialize(v))
          )
          break
        // case 'YArray':
        // root.delete(0, root.length)
        // root.push(value.map(deserialize))
        // break
        default:
          throw new Error('Not implemented')
      }
    } else {
      throw new Error('Not implemented')
    }
  } else {
    const yPath = path.filter((v, k) => k % 2) // Convert Immer path to Y path by removing types
    const parentPath = initial(yPath)
    const property = last(yPath)
    const target = parentPath.reduce((t, key) => t.get(key), root)
    const [type, actualValue] = (() => {
      // Is path [..., ..., type, value] or [..., ..., type, value, type]
      // TODO: Normalize this in a HOF around applyPatch
      if (path.length % 2 === 0) return value
      const type = get(snapshot, [...initial(path), 0])
      return [type, value]
    })()
    if (target instanceof Y.Map) {
      switch (op) {
        case 'add':
        case 'replace':
          target.set(property, deserialize([type, actualValue]))
          break
        case 'remove':
          target.delete(property)
          break
        default:
      }
    } else if (target instanceof Y.Array) {
      if (typeof property !== 'number') {
        throw new Error('Attempted to set non-numeric array index')
      }
      if (op === 'replace' || op === 'remove') target.delete(property)
      if (op === 'replace' || op === 'add') {
        target.insert(property, [deserialize([type, actualValue])])
      }
    } else {
      throw new Error('Not implemented')
    }
  }
}

const applyPatch = (root, { path, op, value = [] }, snapshot) => {
  // TODO: make paths like [..., ..., type, value, type] look like [..., ..., type, value]
  updateY(root, { path, op, value }, snapshot)
}

const applyUpdate = (source, snapshot, fn) => {
  const [, patches] = produceWithPatches(snapshot, fn)
  for (const patch of patches) {
    applyPatch(source, patch, snapshot)
  }
}

export { applyPatch, applyUpdate }

import { enablePatches, produceWithPatches } from 'immer'
import * as Y from 'yjs'
import * as R from 'ramda' // TODO: Replace with lodash etc (too slow for prod)
import deserialize from './deserialize'
import { get } from 'lodash'

enablePatches()

const applyPatch = (root, { path, op, value = [] }, snapshot) => {
  const [type, val] = value
  if (!path.length) {
    if (op !== 'replace') throw new Error('Not implemented')
    if (root instanceof Y.Map && type === 'YMap') {
      root.clear()
      Object.entries(val).forEach(([k, v]) => {
        const yValue = deserialize(v)
        root.set(k, yValue)
      })
    } else if (root instanceof Y.Array && Array.isArray(value)) {
      // root.delete(0, root.length)
      // root.push(value.map(deserialize))
    } else {
      throw new Error('Not implemented')
    }
    return
  } else {
    /*
    This is a bit of a mess
    When pathLengthIsEven, we're splitting up the [type,value], looking up type, then re-building [type,value]
    */
    const pathWithoutTypes = R.compose(
      R.reject(R.isNil),
      R.map(R.prop(1)), // Discard "type"
      R.splitEvery(2) // Split into [ type, key ] pairs
    )(path)
    const parentPath = R.init(pathWithoutTypes)
    const property = R.last(pathWithoutTypes)

    const pathLengthIsEven = path.length % 2 === 0 // Path is either [1,property,1] or [1,property]
    const type = pathLengthIsEven
      ? value[0]
      : get(snapshot, [...R.init(path), 0])
    const v = pathLengthIsEven ? value[1] : value

    const target = parentPath.reduce((t, key) => t.get(key), root)

    if (target instanceof Y.Map) {
      switch (op) {
        case 'add':
        case 'replace':
          target.set(property, deserialize([type, v]))
          break
        case 'remove':
          target.delete(property)
          break
        default:
      }
    } else if (target instanceof Y.Array) {
      if (typeof property !== 'number')
        throw new Error('Attempted to set non-numeric array index')
      if (op === 'replace' || op === 'remove') target.delete(property)
      if (op === 'replace' || op === 'add') {
        target.insert(property, [deserialize([type, v])])
      }
    } else {
      throw new Error('Not implemented')
    }
  }
}

const applyUpdate = (source, snapshot, fn) => {
  const [, patches] = produceWithPatches(snapshot, fn)
  for (const patch of patches) {
    applyPatch(source, patch, snapshot)
  }
}

export { applyPatch, applyUpdate }

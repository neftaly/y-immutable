import produce from 'immer'
import serialize from './serialize'
import * as Y from 'yjs'

const applyYEvents = (snapshot, events) =>
  produce(snapshot, (immerRoot) =>
    events.forEach((event) => void applyYEvent(immerRoot, event))
  )

const applyYEvent = (immerRoot, event) => {
  const immerProxyToUpdate =
    event.path && event.path.reduce((acc, k) => acc[1][k], immerRoot)
  // const type = immerProxyToUpdate.type[0] // TODO: Handle type changes
  if (event instanceof Y.YMapEvent) {
    event.changes.keys.forEach((change, key) => {
      // const type = immerProxyToUpdate[0]
      switch (change.action) {
        case 'add':
        case 'update':
          immerProxyToUpdate[1][key] = serialize(event.target.get(key))
          break
        case 'delete':
          delete immerProxyToUpdate[1][key]
          break
        default:
          break
      }
    })
  } else if (event instanceof Y.YArrayEvent) {
    let retain = 0
    event.changes.delta.forEach((change) => {
      if (change.retain) retain += change.retain
      if (change.delete) immerProxyToUpdate[1].splice(retain, change.delete)
      if (change.insert) {
        const insert = Array.isArray(change.insert)
          ? change.insert
          : [change.insert]
        immerProxyToUpdate[1].splice(retain, 0, ...insert.map(serialize))
        retain += insert.length
      }
    })
  } else {
    throw new Error('Not implemented')
  }
}

export { applyYEvents, applyYEvent }

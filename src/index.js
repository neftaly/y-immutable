import { applyUpdate } from './toY'
import serialize from './serialize'
import deserialize from './deserialize'
import { applyYEvents } from './fromY'
import * as Y from 'yjs'

/**
 * Bind Yjs data type.
 * @param source The Yjs data type to bind.
 * @param options Change default behavior, can be omitted.
 */
const bind = (source) => {
  let snapshot = serialize(source)
  const subscription = new Set()
  const observer = (events) => {
    snapshot = applyYEvents(get(), events)
    subscription.forEach((fn) => fn(get()))
  }
  source.observeDeep(observer)

  const get = () => snapshot
  const unbind = () => void source.unobserveDeep(observer)
  const subscribe = (fn) => {
    subscription.add(fn)
    return () => void subscription.delete(fn)
  }
  const update = (fn) => {
    const doUpdate = () => applyUpdate(source, get(), fn)
    if (source.doc) {
      Y.transact(source.doc, doUpdate)
    } else {
      doUpdate()
    }
  }

  return {
    unbind,
    get,
    update,
    subscribe
  }
}

export { serialize, deserialize }
export default bind

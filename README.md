# immer-yjs-typed [![npm](https://img.shields.io/npm/v/immer-yjs-typed.svg)](https://www.npmjs.com/package/immer-yjs-typed)

# STATUS: Alpha WIP - not ready for production use

This is a wrapper for Yjs that aims to provide a consistent immutable API.

immer-yjs-types combines [Yjs](https://github.com/yjs/yjs), a CRDT library with a mutation-based API, with [immer](https://github.com/immerjs/immer), a library with immutable data manipulation using plain JS objects. It is based on [sep2/immer-yjs](https://github.com/sep2/immer-yjs).

## React example

For Zustand, see [the recipes doc](https://docs.pmnd.rs/zustand/recipes/recipes#sick-of-reducers-and-changing-nested-state?-use-immer!).

For vanilla React, the most efficent way is to use [useSyncExternalStoreWithSelector](https://github.com/reactwg/react-18/discussions/86):

```js
import bind from 'immer-yjs-typed'

// Setup Y store
const doc = new Y.Doc()
const ymap = doc.getMap('appstate.v1')

// Attach immer-yjs-typed
const binder = bind(ymap);

// Initialize state
binder.update((state) => (
  // immer-yjs-typed data uses the format [ type, value ]
  ['YMap': {
    count: ['number', 0]
  }]
));

// Define an Immer helper hook
function useImmerYjs<Selection>(selector: (state: State) => Selection) {
  const selection = useSyncExternalStoreWithSelector(
    binder.subscribe,
    binder.get,
    binder.get,
    selector
  )
  return [selection, binder.update]
}

// use in component
function Component() {
  const [count, update] = useImmerYjs((s) => s[1].count[1]) // Don't forget the [1] after each prop

  const handleClick = () => {
    update((s) => {
      // any operation supported by immer
      s[1].count[1]++
    })
  }

  // will only rerender when 'count' changed
  return <button onClick={handleClick}>{count}</button>
}

// when done
binder.unbind()
```

# Documentation

## Typing

Yjs data is encoded in Immer as `[type, value]` tuples. This is done so that Yjs CRDTs can be represented as plain JS objects (POJOs).

```js
import { deserialize } from 'immer-yjs-typed'

const json = ['YArray', [
  ['YMap', {
    title: ['string', 'write tests'],
    checked: ['boolean', true]
  }],
  ['YMap', {
    title: ['string', 'dogfood app'],
    checked: ['boolean', false]
  }]
]]

const ydata = deserialize(json)
```

The equivalent Yjs object can be converted back to a POJO:

```js
import { serialize } from 'immer-yjs-typed'

const yArray = Y.Array.from
const yMap = data => new Y.Map(Object.entries(data))

const ydata = yArray([
  yMap({
    title: 'write tests',
    checked: true
  }),
  yMap({
    title: 'dogfood app',
    checked: false
  })
])

const json = serialize(ydata)
```

Supported types are:

- [`YMap`](https://docs.yjs.dev/api/shared-types/y.map)
- [`YArray`](https://docs.yjs.dev/api/shared-types/y.array)
- [`YText`](https://docs.yjs.dev/api/shared-types/y.text)
- `object`
- `array`
- `string`
- `number`
- `boolean`
- `null`

## Yjs/immer binder

The binder wraps a Yjs doc in an immer wrapper, which can then be subscribed to.

1. `import { bind } from 'immer-yjs'`.
2. Create a binder: `const binder = bind(doc.getMap("state"))`.
3. Add subscription to the snapshot: `binder.subscribe(listener)`.
   1. Mutations in `y.js` data types will trigger snapshot subscriptions.
   2. Calling `update(...)` (similar to `produce(...)` in `immer`) will update their corresponding `y.js` types and also trigger snapshot subscriptions.
4. Call `binder.get()` to get the latest snapshot.
5. (Optionally) call `binder.unbind()` to release the observer.

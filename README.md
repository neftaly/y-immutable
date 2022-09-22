# immer-yjs-typed [![npm](https://img.shields.io/npm/v/immer-yjs-typed.svg)](https://www.npmjs.com/package/immer-yjs-typed)

# STATUS: Alpha WIP - not ready for production use

This library provides a simple way to support peer-to-peer and multi-user shared objects and text in React, Vue, etc. It combines [Yjs](https://github.com/yjs/yjs), a CRDT library with a mutation-based API, with [immer](https://github.com/immerjs/immer), a library with immutable data manipulation using plain JS objects. It is based on [sep2/immer-yjs](https://github.com/sep2/immer-yjs).

# Installation

`npm install immer-yjs-typed immer yjs`

# Documentation

1. `import { bind } from 'immer-yjs'`.
2. Create a binder: `const binder = bind(doc.getMap("state"))`.
3. Add subscription to the snapshot: `binder.subscribe(listener)`.
   1. Mutations in `y.js` data types will trigger snapshot subscriptions.
   2. Calling `update(...)` (similar to `produce(...)` in `immer`) will update their corresponding `y.js` types and also trigger snapshot subscriptions.
4. Call `binder.get()` to get the latest snapshot.
5. (Optionally) call `binder.unbind()` to release the observer.

## Typing

The immer objects encode Yjs data into `[type, value]` tuples.

Supported types are:

- [`YMap`](https://docs.yjs.dev/api/shared-types/y.map)
- [`YArray`](https://docs.yjs.dev/api/shared-types/y.array)
- [`YText`](https://docs.yjs.dev/api/shared-types/y.text)
- <strike>[`XmlFragment`](https://docs.yjs.dev/api/shared-types/y.xmlfragment)</strike>
- <strike>[`XmlElement`](https://docs.yjs.dev/api/shared-types/y.xmlelement)</strike>
- <strike>[`XmlText`](https://docs.yjs.dev/api/shared-types/y.xmltext)</strike>
- `object`
- `array`
- `string`
- `number`
- `boolean`
- `null`

For example, a Yjs object can be serialized into the equivalent JSON:

```js
import { serialize } from 'immer-yjs-typed`

// Note that Yjs doesn't actually support this syntax
const ydata = new Y.Array([
  new Y.Map({
    title: 'write tests',
    checked: true
  }),
  new Y.Map({
    title: 'dogfood app',
    checked: false
  })
])

const json = serialize(ydata)
```

The same JSON can also be serialized back to a Yjs object:

```js
import { deserialize } from 'immer-yjs-typed`

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

## React integration

For Zustand, see [the recipes doc](https://docs.pmnd.rs/zustand/recipes/recipes#sick-of-reducers-and-changing-nested-state?-use-immer!).

For vanilla React, the most efficent way is to use [useSyncExternalStoreWithSelector](https://github.com/reactwg/react-18/discussions/86):

```js
import { bind } from 'immer-yjs-typed'

// Setup store
const doc = new Y.Doc()
const ymap = doc.getMap('appstate.v1')

// Attach immer-yjs-typed
const binder = bind(ymap);

// Initialize state
binder.update((state) => (
  ['YMap': {
    count: ['number', 0]
  }]
));

// define a helper hook
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
  const [count, update] = useImmerYjs((s) => s[1].count[1])

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

import * as Y from 'yjs'

// Test JSON and test Y data trees are equivalent

const generateTestJson = () => [
  'YMap',
  {
    teststring: ['string', 'hello'],
    testnull: ['null', null],
    testobject: [
      'object',
      {
        a: ['string', 'aaa']
      }
    ],
    testarray: ['array', [['number', 0]]],
    testboolean: ['boolean', false],
    testnumber: ['number', 0],
    testYMap: [
      'YMap',
      {
        testnumber: ['number', 0]
      }
    ],
    testYText: ['YText', 'hey'],
    testYArray: [
      'YArray',
      [
        ['number', 5],
        ['number', 0],
        ['number', 7]
      ]
    ]
  }
]

const generateTestYData = () => {
  const ydoc = new Y.Doc()
  const ymap = ydoc.getMap()
  ymap.set('testnull', null)
  ymap.set('testobject', { a: 'aaa' })
  ymap.set('testarray', [0])
  ymap.set('testboolean', false)
  ymap.set('teststring', 'hello')
  ymap.set('testnumber', 0)
  ymap.set('testYMap', new Y.Map([['testnumber', 0]]))
  ymap.set('testYText', new Y.Text('hey'))
  const arr = new Y.Array()
  arr.insert(0, [5, 0, 7])
  ymap.set('testYArray', arr)
  return ymap
}

export { generateTestYData, generateTestJson }

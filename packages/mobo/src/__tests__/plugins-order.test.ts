import { Mobo } from '../mobo'

test('init', () => {
  const m = new Mobo([], [])
  expect(m.plugins).toEqual([])
})

test('use order', () => {
  const m = new Mobo([], [])
  m.use({ id: '1' })
  m.use({ id: '2' }, { id: '3' })
  expect(m.plugins).toEqual([
    {
      id: '1',
    },
    {
      id: '2',
    },
    {
      id: '3',
    },
  ])
})

test('unuse order', () => {
  const m = new Mobo([], [])
  m.use({ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' })
  m.unuse({ id: '2' })
  expect(m.plugins).toEqual([
    {
      id: '1',
    },
    {
      id: '3',
    },
    { id: '4' },
  ])
  m.unuse({ id: '1' })
  expect(m.plugins).toEqual([
    {
      id: '3',
    },
    { id: '4' },
  ])
})

test('after before', () => {
  const m = new Mobo([], [])
  m.use({ id: '1' })
  m.use({ id: '2' }, { id: '3' })
  m.use(
    {
      id: '4',
      position: {
        target: { id: '1' },
      },
    },
    {
      id: '5',
      position: {
        type: 'after',
        target: { id: '1' },
      },
    },
    {
      id: '6',
      position: {
        type: 'before',
        target: { id: '3' },
      },
    },
  )
  expect(m.plugins).toEqual([
    {
      id: '1',
    },
    {
      id: '5',
      position: {
        type: 'after',
        target: { id: '1' },
      },
    },
    {
      id: '4',
      position: {
        target: { id: '1' },
      },
    },
    {
      id: '2',
    },
    {
      id: '6',
      position: {
        type: 'before',
        target: { id: '3' },
      },
    },
    {
      id: '3',
    },
  ])
})

test('replace', () => {
  const m = new Mobo([], [])
  m.use({ id: '1' })
  m.use({ id: '2' }, { id: '3' })
  m.use({
    id: '4',
    position: {
      target: { id: '1' },
    },
    replace: [{ id: '1' }],
  })
  expect(m.plugins).toEqual([
    {
      id: '4',
      position: {
        target: { id: '1' },
      },
      replace: [{ id: '1' }],
    },
    {
      id: '2',
    },
    {
      id: '3',
    },
  ])
})

test('const plugins', () => {
  const x = [] as const
  const m = new Mobo(x, x)
  expect(m).toBeTruthy()
})

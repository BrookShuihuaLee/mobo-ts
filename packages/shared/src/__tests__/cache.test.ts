import { cacheOneParamFn } from '../cache'

test('cacheOneParamFn', () => {
  const addOne = jest.fn((v: number) => v + 1)
  const fn = cacheOneParamFn(addOne)
  expect(fn(1)).toBe(2)
  expect(fn(2)).toBe(3)
  expect(fn(2)).toBe(3)
  expect(addOne.mock.calls.length).toEqual(2)
})

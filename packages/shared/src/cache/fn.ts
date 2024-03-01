/**
 * 缓存单参数函数
 * @param fn 函数
 */
export function cacheOneParamFn<T, R>(
  fn: (arg: T) => R,
  m = new Map<T, R>(),
): (arg: T) => R {
  return (arg) => {
    if (m.has(arg)) {
      return m.get(arg) as R
    }
    const ret = fn(arg)
    m.set(arg, ret)
    return ret
  }
}

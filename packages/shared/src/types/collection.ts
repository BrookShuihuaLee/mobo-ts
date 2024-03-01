import { Union2Tuple, UnionToIntersection } from 'free-types'
import { ReadonlyEmptyArray, ReadonlyUnknownArray } from './any-unknown'

export { Union2Tuple, UnionToIntersection }

/**
 * 元组转联合类型
 */
export type Tuple2Union<T extends ReadonlyUnknownArray> =
  T extends ReadonlyEmptyArray
    ? never // ? LiteralObject
    : T extends readonly [infer P]
      ? P
      : T extends readonly [infer P, ...infer O]
        ? P | Tuple2Union<O>
        : T extends readonly (infer P)[]
          ? P
          : never

/**
 * 元组转交叉类型
 */
export type Tuple2Intersection<T extends ReadonlyUnknownArray> =
  UnionToIntersection<Tuple2Union<T>>

/**
 * 元组排除
 */
export type TupleExclude<
  T extends ReadonlyUnknownArray,
  P extends ReadonlyUnknownArray,
> = Union2Tuple<Exclude<Tuple2Union<T>, Tuple2Union<P>>>

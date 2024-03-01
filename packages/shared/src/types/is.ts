/**
 * 是 never
 */
export type IsNever<T> = [T] extends [never] ? true : false

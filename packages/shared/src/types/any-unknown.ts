/**
 * 任意键值
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyKey = keyof any

/**
 * 字面对象
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export type LiteralObject = {}

/**
 * 空对象
 */
export type EmptyObject = Record<AnyKey, never>

/**
 * 值未知对象
 */
export type UnknownObject = Record<AnyKey, unknown>

/**
 * 任意对象
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyObject = Record<AnyKey, any>

/**
 * 任意数组
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyArray = any[]

/**
 * 只读任意数组
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ReadonlyAnyArray = readonly any[]

/**
 * 未知数组
 */
export type UnknownArray = unknown[]

/**
 * 只读未知数组
 */
export type ReadonlyUnknownArray = readonly unknown[]

/**
 * 空数组
 */
export type EmptyArray = []

/**
 * 只读空数组
 */
export type ReadonlyEmptyArray = readonly []

/**
 * 任意函数
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyFunction = (...args: any[]) => any

/**
 * 任意类
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyClass = new (...args: any[]) => any

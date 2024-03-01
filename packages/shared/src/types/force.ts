import { LiteralObject } from './any-unknown'
import { IsNever } from './is'

/**
 * 强制转为对象
 */
export type ForceToObject<T, D = LiteralObject> =
  IsNever<T> extends true ? D : T extends LiteralObject ? NonNullable<T> : D

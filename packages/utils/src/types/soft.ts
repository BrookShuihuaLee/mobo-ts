import { AnyKey, EmptyObject, LiteralObject } from './any-unknown'

/**
 * 软 as
 */
export type SoftAs<T, P> = T extends P ? T : never

/**
 * 软取属性
 */
export type SoftPropOf<O extends LiteralObject, P extends AnyKey> = (O &
  EmptyObject)[P]

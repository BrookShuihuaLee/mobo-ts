import {
  Disposer,
  ForceToObject,
  LinkedMapPosition,
  LiteralObject,
  SoftAs,
  SoftPropOf,
  UnionToIntersection,
  UnknownObject,
} from '@mobo-ts/shared'
import { A, Type, apply } from 'free-types'
import { MoboContext } from './mobo-context'

/**
 * 主板默认属性扩展，对象形式
 */
export type MoboDefaultPropertiesExtObj<ExtKey extends string = string> =
  Partial<Record<ExtKey | InitOptionsExtKey<ExtKey>, UnknownObject>>

/**
 * 主板默认属性扩展，高等类型形式
 */
export interface MoboDefaultPropertiesExtHkt extends Type<1> {
  /**
   * 内部使用，用于类型推导
   */
  // eslint-disable-next-line @typescript-eslint/naming-convention
  _hkt: true
}

/**
 * MoboDefaultPropertiesExtHkt 插件辅助类型
 */
export type MoboDefaultPropertiesExtHktPlugin<T extends Type<1>> = SoftAs<
  A<T>,
  AnyMoboPlugin
>

/**
 * 主板默认属性扩展
 */
export type MoboDefaultPropertiesExt =
  /**
   * MoboDefaultPropertiesExtObj<string> 会导致 interface 属性扩展报错，
   * MoboDefaultPropertiesExtObj 提供给自定义插件类型里有具体 ExtKey 的场景使用
   */
  LiteralObject | MoboDefaultPropertiesExtHkt

/**
 * 主板插件
 */
export interface MoboPlugin<
  PropertiesExt extends MoboDefaultPropertiesExt = LiteralObject,
> {
  /**
   * 唯一标识
   */
  id: string
  /**
   * 位置
   */
  position?: MoboPluginPosition
  /**
   * 替换（插件），加载当前插件后，会删除这些插件
   */
  replace?: readonly AnyMoboPlugin[]
  /**
   * 内部使用，用于类型推导
   */
  // eslint-disable-next-line @typescript-eslint/naming-convention
  _e?: PropertiesExt
  /**
   * 初始化函数
   * 这里需要继承 MoboPlugin 并细化类型
   * TODO: string 类型不能按键值细化类型，后续再看有没有更好的解决方法
   */
  [K: MoboPluginInitFnKey<string>]: AnyMoboPluginInitFn | undefined
}

/**
 * 任意主板插件
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyMoboPlugin = MoboPlugin<any>

/**
 * 主板插件位置
 */
export interface MoboPluginPosition {
  /**
   * 类型，默认: `'after'`
   */
  type?: LinkedMapPosition<string>['type']
  /**
   * 目标（插件）
   */
  target: AnyMoboPlugin
}

/**
 * 主板插件初始化函数键值
 */
export type MoboPluginInitFnKey<ExtKey extends string = string> =
  `init${Capitalize<ExtKey>}`

/**
 * 主板插件初始化函数
 */
export type MoboPluginInitFn<T> = (ctx: T) => Disposer | void

/**
 * 通过插件（描述）主板插件初始化函数
 */
export type MoboPluginInitFnByPlugin<
  Plugin extends AnyMoboPlugin,
  ExtKey extends string,
> = MoboPluginInitFn<MoboContext<Plugin, ExtKey>>

/**
 * 任意主板插件初始化函数
 */
export type AnyMoboPluginInitFn = MoboPluginInitFnByPlugin<
  AnyMoboPlugin,
  string
>
/**
 * 主板插件的属性扩展
 */
export type PropertiesExtOfMoboPlugin<
  Plugin extends AnyMoboPlugin,
  PluginFullUnion extends AnyMoboPlugin = Plugin,
> =
  Plugin extends MoboPlugin<infer PropertiesExt>
    ? PropertiesExt extends MoboDefaultPropertiesExtHkt
      ? apply<PropertiesExt, [PluginFullUnion]>
      : PropertiesExt
    : MoboDefaultPropertiesExtObj

/**
 * 初始化选项扩展键值
 */
export type InitOptionsExtKey<ExtKey extends string> = `${ExtKey}InitOptions`

/**
 * 通过主板插件（推导的）初始化选项
 */
export type InitOptionsByMoboPlugin<
  Plugin extends AnyMoboPlugin,
  ExtKey extends string,
> = ContextPropertiesExtByMoboPlugin<Plugin, InitOptionsExtKey<ExtKey>>

/**
 * 通过主板插件（推导的）上下文属性扩展
 */
export type ContextPropertiesExtByMoboPlugin<
  Plugin extends AnyMoboPlugin,
  ExtKey extends string,
> = UnionToIntersection<
  ForceToObject<SoftPropOf<PropertiesExtOfMoboPlugin<Plugin>, ExtKey>>
>

//#region 对外提供的工具类型

/**
 * 主板上下文的插件
 */
export type PluginOfMoboContext<T extends MoboContext<AnyMoboPlugin, string>> =
  T extends MoboContext<infer Plugin extends AnyMoboPlugin, string>
    ? Plugin
    : never

/**
 * 主板上下文的扩展键值
 */
export type ExtKeyOfMoboContext<T extends MoboContext<AnyMoboPlugin, string>> =
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  T extends MoboContext<infer _Plugin extends AnyMoboPlugin, infer ExtKey>
    ? ExtKey
    : never

/**
 * 主板上下文的初始化选项
 */
export type InitOptionsOfMoboContext<
  T extends MoboContext<AnyMoboPlugin, string>,
> = InitOptionsByMoboPlugin<PluginOfMoboContext<T>, ExtKeyOfMoboContext<T>>

//#endregion

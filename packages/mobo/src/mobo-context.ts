import { DisposableByDisposer } from '@mobo-ts/shared'
import { getMoboPluginInitFnKey } from './tools'
import {
  AnyMoboPlugin,
  ContextPropertiesExtByMoboPlugin,
  InitOptionsByMoboPlugin,
  MoboPluginInitFn,
  MoboPluginInitFnKey,
} from './types'

/**
 * 内部主板上下文
 */
export class InternalMoboContext<
  Plugin extends AnyMoboPlugin,
  ExtKey extends string,
> extends DisposableByDisposer {
  /**
   * 插件（内部使用）
   */
  private _plugins: readonly Plugin[]

  /**
   * 插件
   */
  public get plugins(): readonly Plugin[] {
    return this._plugins
  }

  /**
   * 扩展键值
   */
  public extKeys: readonly ExtKey[]

  /**
   * 初始化选项
   */
  public initOptions!: InitOptionsByMoboPlugin<Plugin, ExtKey>

  /**
   * 内部主板上下文
   * @param plugins 插件
   * @param extKeys 扩展键值
   */
  public constructor(plugins: readonly Plugin[], extKeys: readonly ExtKey[]) {
    super()
    this._plugins = plugins
    this.extKeys = extKeys
  }

  /**
   * 初始化
   * @param initOptions 初始化选项
   */
  public init(initOptions: InitOptionsByMoboPlugin<Plugin, ExtKey>): this {
    this.initOptions = initOptions
    for (const plugin of this.plugins) {
      for (const extKey of this.extKeys) {
        const initFnKey = getMoboPluginInitFnKey(extKey)
        try {
          const disposer = (
            plugin as unknown as Record<
              MoboPluginInitFnKey<ExtKey>,
              MoboPluginInitFn<this> | undefined
            >
          )[initFnKey]?.(this)
          if (disposer) {
            this.disposers.push(disposer)
          }
        } catch (err) {
          if (process.env.NODE_ENV !== 'test') {
            console.error('init failed', plugin, initFnKey, err)
          }
          throw err
        }
      }
    }
    return this
  }

  /**
   * （创建并）初始化子上下文
   * @param subExtKeys 子上下文扩展键值
   * @param initOptions 初始化选项
   */
  public initSubcontext<SubExtKey extends string>(
    subExtKeys: readonly SubExtKey[],
    initOptions: InitOptionsByMoboPlugin<Plugin, SubExtKey>,
  ): MoboContext<Plugin, SubExtKey> {
    return new MoboContext(this.plugins, subExtKeys).init(initOptions)
  }
}

/**
 * 主板上下文
 */
export type MoboContext<
  Plugin extends AnyMoboPlugin,
  ExtKey extends string,
> = InternalMoboContext<Plugin, ExtKey> &
  ContextPropertiesExtByMoboPlugin<Plugin, ExtKey>

/**
 * 主板上下文
 * @param plugins 插件
 * @param extKeys 扩展键值
 */
export const MoboContext = InternalMoboContext as new <
  Plugin extends AnyMoboPlugin,
  ExtKey extends string,
>(
  plugins: readonly Plugin[],
  extKeys: readonly ExtKey[],
) => MoboContext<Plugin, ExtKey>

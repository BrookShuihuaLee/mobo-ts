import {
  createLinkedMap,
  LinkedMapPosition,
  Tuple2Union,
} from '@mobo-ts/shared'
import { InternalMoboContext } from './mobo-context'
import { AnyMoboPlugin, ContextPropertiesExtByMoboPlugin } from './types'

/**
 * 内部主板
 */
export class InternalMobo<
  Plugin extends AnyMoboPlugin,
  ExtKey extends string,
> extends InternalMoboContext<Plugin, ExtKey> {
  /**
   * 链表 Map
   */
  private _linkedMap = createLinkedMap<string, Plugin>()

  /**
   * 插件
   */
  public get plugins(): readonly Plugin[] {
    return [...this._linkedMap.values()]
  }

  public constructor(plugins: readonly Plugin[], extKeys: readonly ExtKey[]) {
    super([], extKeys)
    this.use(...plugins)
  }

  /**
   * 使用
   * @param plugins 插件
   */
  public use<UsePlugins extends readonly AnyMoboPlugin[]>(
    ...plugins: UsePlugins
  ): Mobo<Plugin | Tuple2Union<UsePlugins>, ExtKey> {
    for (const plugin of plugins) {
      const { id, position, replace } = plugin
      let linkedMapPosition: LinkedMapPosition<string> | undefined
      if (position) {
        linkedMapPosition = {
          type: position.type,
          targetKey: position.target.id,
        }
      }
      this._linkedMap.set(id, plugin as unknown as Plugin, linkedMapPosition)
      if (replace) {
        this.unuse(...replace)
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this as any
  }

  /**
   * 停止使用
   * @param plugins 插件（或插件 id）
   */
  public unuse<UnusePlugins extends readonly AnyMoboPlugin[]>(
    ...plugins: UnusePlugins
  ): Mobo<Exclude<Plugin, Tuple2Union<UnusePlugins>>, ExtKey> {
    for (const plugin of plugins) {
      this._linkedMap.delete(plugin.id)
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this as any
  }
}

/**
 * 主板
 */
export type Mobo<
  Plugin extends AnyMoboPlugin,
  ExtKey extends string,
> = InternalMobo<Plugin, ExtKey> &
  ContextPropertiesExtByMoboPlugin<Plugin, ExtKey>

/**
 * 主板
 * @param plugins 插件
 * @param extKeys 扩展键值
 */
export const Mobo = InternalMobo as new <
  Plugin extends AnyMoboPlugin,
  ExtKey extends string,
>(
  plugins: readonly Plugin[],
  extKeys: readonly ExtKey[],
) => Mobo<Plugin, ExtKey>

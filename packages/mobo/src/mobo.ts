import { Tuple2Union } from '@mobo-ts/utils'
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
   * 使用
   * @param plugins 插件
   */
  public use<UsePlugins extends readonly AnyMoboPlugin[]>(
    ...plugins: UsePlugins
  ): Mobo<Plugin | Tuple2Union<UsePlugins>, ExtKey> {
    let newThisPlugins = [...this.plugins]
    for (const plugin of plugins) {
      const { position } = plugin
      let idx = -1
      if (position) {
        const targetId = position.targetId
        idx = newThisPlugins.findIndex((p) => p.id === targetId)
        if (idx !== -1 && position.type !== 'before') {
          idx++
        }
      }
      if (idx !== -1) {
        newThisPlugins.splice(idx, 0, plugin as unknown as Plugin)
      } else {
        newThisPlugins.push(plugin as unknown as Plugin)
      }
      const replace = position?.replace
      if (replace) {
        this.plugins = newThisPlugins
        this.unuse(...replace)
        newThisPlugins = this.plugins as typeof newThisPlugins
      }
    }
    this.plugins = newThisPlugins
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this as any
  }

  /**
   * 停止使用
   * @param plugins 插件（或插件 id）
   */
  public unuse<UnusePlugins extends readonly (AnyMoboPlugin | string)[]>(
    ...plugins: UnusePlugins
  ): Mobo<Exclude<Plugin, Tuple2Union<UnusePlugins>>, ExtKey> {
    const set = new Set(plugins.map((p) => (typeof p === 'string' ? p : p.id)))
    this.plugins = this.plugins.filter((p) => !set.has(p.id))
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

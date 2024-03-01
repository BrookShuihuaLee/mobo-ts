import { cacheOneParamFn } from '@mobo-ts/shared'
import { MoboPluginInitFnKey } from './types'

/**
 * 获取主板插件初始化函数键值
 * @param extKey 扩展键值
 */
export const getMoboPluginInitFnKey = cacheOneParamFn(
  <ExtKey extends string>(extKey: ExtKey): MoboPluginInitFnKey<ExtKey> => {
    return `init${extKey.slice(0, 1).toUpperCase()}${extKey.slice(1)}` as MoboPluginInitFnKey<ExtKey>
  },
)

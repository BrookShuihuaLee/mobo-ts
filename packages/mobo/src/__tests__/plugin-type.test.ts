import { Mobo } from '../mobo'
import {
  AnyMoboPlugin,
  MoboDefaultPropertiesExt,
  MoboPlugin,
  MoboPluginInitFnByPlugin,
} from '../types'

test('Custom plugin interface type', () => {
  interface DodoPlugin<
    PropertiesExt extends MoboDefaultPropertiesExt,
    DepPlugin extends AnyMoboPlugin = never,
  > extends MoboPlugin<PropertiesExt> {
    /**
     * init Dodo
     */
    initDodo?: MoboPluginInitFnByPlugin<this | DepPlugin, 'dodo'>
  }

  function createDodo<Plugin extends AnyMoboPlugin>(
    plugins: readonly Plugin[],
  ): Mobo<Plugin, 'dodo'> {
    return new Mobo(plugins, ['dodo'])
  }

  interface PPropertiesExt {
    dodo: {
      /**
       * sadf
       */
      a: number
    }
    dodoInitOptions: {
      b: number
    }
  }

  const p: DodoPlugin<PPropertiesExt> = {
    id: '1',
    initDodo(ctx) {
      ctx.a = ctx.initOptions.b + 1
    },
  }

  const dodo = createDodo([p]).init({ b: 4 })
  expect(dodo.a).toEqual(5)
})

import { Mobo } from '../mobo'
import { MoboContext } from '../mobo-context'
import {
  AnyMoboPlugin,
  MoboDefaultPropertiesExt,
  MoboDefaultPropertiesExtHkt,
  MoboDefaultPropertiesExtHktPlugin,
  MoboDefaultPropertiesExtObj,
  MoboPlugin,
  MoboPluginInitFnByPlugin,
} from '../types'

test('How to use', () => {
  const p: MoboPlugin<{
    mm: {
      /**
       * a 3234
       */
      a: number
    }
    mmInitOptions: {
      /**
       * bbbbbs
       */
      b: number
    }
    abcDd: {
      /**
       * 234
       */
      jjx: number[]
    }
    abcDdInitOptions: {
      /**
       * lkdjf
       */
      sdf: string[]
    }
  }> = {
    id: '1',
    initMm(ctx) {
      ctx.a = ctx.initOptions.b + 1
    },
    initAbcDd(ctx) {
      ctx.jjx = ctx.initOptions.sdf.map((s: string) => Number(s))
    },
  }

  const m = new Mobo([p], ['mm']).init({ b: 4 })
  expect(m.a).toEqual(5)
  const ctx = m.initSubcontext(['abcDd'], {
    sdf: ['1', '2'],
  })
  expect(ctx.jjx).toEqual([1, 2])

  const m2 = new Mobo([], ['mm']).use(p).init({ b: 43 })
  expect(m2.a).toEqual(44)
})

test('Custom plugin type', () => {
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

  const p: DodoPlugin<{
    dodo: {
      a: number
    }
    dodoInitOptions: {
      b: number
    }
  }> = {
    id: '1',
    initDodo(ctx) {
      ctx.a = ctx.initOptions.b + 1
    },
  }

  const dodo = createDodo([p]).init({ b: 4 })
  expect(dodo.a).toEqual(5)
})

test('Custom plugin higher kinded type', () => {
  type DodoDefaultPropertiesExt =
    | MoboDefaultPropertiesExtObj<'context' | 'dodo'>
    | MoboDefaultPropertiesExtHkt

  interface DodoPlugin<
    PropertiesExt extends DodoDefaultPropertiesExt,
    DepPlugin extends AnyMoboPlugin = never,
  > extends MoboPlugin<PropertiesExt> {
    /**
     * init Context
     */
    initContext?: MoboPluginInitFnByPlugin<this | DepPlugin, 'context'>
    /**
     * init Dodo
     */
    initDodo?: MoboPluginInitFnByPlugin<this | DepPlugin, 'context' | 'dodo'>
  }

  function createDodo<Plugin extends AnyMoboPlugin>(
    plugins: readonly Plugin[],
  ): Mobo<Plugin, 'context' | 'dodo'> {
    return new Mobo(plugins, ['context', 'dodo'])
  }

  const p1: DodoPlugin<{
    dodo: {
      a: number
    }
    dodoInitOptions: {
      b: number
    }
  }> = {
    id: '1',
    initDodo(ctx) {
      ctx.a = ctx.initOptions.b + 1
    },
  }
  const p2: DodoPlugin<
    {
      context: {
        co: number[]
      }
      contextInitOptions: {
        ci: number
      }
    },
    typeof p1
  > = {
    id: '2',
    initContext(ctx) {
      ctx.co = [ctx.initOptions.ci * 2]
    },
    initDodo(ctx) {
      ctx.co.push(ctx.a++)
    },
  }
  interface MyPropertiesExtHkt<Plugin extends AnyMoboPlugin> {
    context: {
      /**
       * asdf
       */
      parent?:
        | MoboContext<Plugin, 'context'>
        | MoboContext<Plugin, 'context' | 'dodo'>
    }
    contextInitOptions: {
      /**
       * in333
       */
      parent?:
        | MoboContext<Plugin, 'context'>
        | MoboContext<Plugin, 'context' | 'dodo'>
    }
  }
  interface $MyPropertiesExtHkt extends MoboDefaultPropertiesExtHkt {
    type: MyPropertiesExtHkt<MoboDefaultPropertiesExtHktPlugin<this>>
  }
  const p3: DodoPlugin<$MyPropertiesExtHkt> = {
    id: '3',
    initContext(ctx) {
      ctx.parent = ctx.initOptions.parent
    },
  }

  const m = createDodo([p1]).use(p2, p3).init({ b: 4, ci: 3 })
  expect(m.a).toEqual(6)
  expect(m.co).toEqual([6, 5])
  expect(m.parent).toBeUndefined()
  const ctx = m.initSubcontext(['context'], {
    ci: 7,
    parent: m,
  })
  expect(ctx.co).toEqual([14])
  expect(ctx.parent).toBe(m)
  const ctx2 = ctx.initSubcontext(['context'], {
    ci: 7,
    parent: ctx,
  })
  expect(ctx2.co).toEqual([14])
  expect(ctx2.parent).toBe(ctx)

  // extra
  const m2 = createDodo([p1]).use(p2).unuse(p2).init({ b: 4 })
  expect(m2.a).toEqual(5)
})

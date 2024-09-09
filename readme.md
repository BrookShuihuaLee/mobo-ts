English (US) | [中文（简体）](./readme-zh-cn.md)

# Mobo

Mobo (Motherboard), A pluggable typescript library.

[![](https://s1.locimg.com/2024/09/09/ee0ba0dac1974.png)](https://stackblitz.com/edit/vitejs-vite-hyb4ts?file=src%2Ftest-mobo.ts)

# Installation

```sh
pnpm i @mobo-ts/mobo
# or
npm i @mobo-ts/mobo
```

# Usage

The plugin mainly consists of three parts:

- Context type: declared in `MoboPlugin` by the extended key, such as: `abc`.
- Context initialization options type: declared in `MoboPlugin` by the extended key merged by `InitOptions`, such as: `abcInitOptions`.
- Initialization function: implemented in the plugin object by `init` merged by the extended key, such as: `initAbc`.

There are accurate type hints in `Mobo` initialization and subcontext initialization. When the context is initializing, the initialization functions in all plugins will also be called, completing the process in a divide-and-conquer manner.

```ts
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
console.log(m.a) // 5
const ctx = m.initSubcontext(['abcDd'], {
  sdf: ['1', '2'],
})
console.log(ctx.jjx) // [1, 2]

const m2 = new Mobo([], ['mm']).use(p).init({ b: 43 })
console.log(m2.a) // 44
```

## Custom plugin type

```ts
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
console.log(dodo.a) // 5
```

## Custom plugin higher kinded type

Thanks [free-types](https://github.com/geoffreytools/free-types).

```ts
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
console.log(m.a) // 6
console.log(m.co) // [6, 5]
console.log(m.parent) // undefined
const ctx = m.initSubcontext(['context'], {
  ci: 7,
  parent: m,
})
console.log(ctx.co) // [14]
console.log(ctx.parent) // m
const ctx2 = ctx.initSubcontext(['context'], {
  ci: 7,
  parent: ctx,
})
console.log(ctx2.co) // [14]
console.log(ctx2.parent) // ctx
```

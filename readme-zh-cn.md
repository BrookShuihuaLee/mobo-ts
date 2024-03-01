# Mobo

Mobo (Motherboard), 一个插件化 TS 库。

# 安装

```sh
pnpm i @mobo-ts/mobo
# or
npm i @mobo-ts/mobo
```

# 使用

插件主要由三个部分组成：

- 上下文类型：在 `MoboPlugin` 里通过扩展键值来声明，比如：`abc`。
- 上下文初始化选项类型：在 `MoboPlugin` 里通过扩展键值拼接 `InitOptions` 来声明，比如：`abcInitOptions`。
- 初始化函数：在插件对象里通过 `init` 拼接扩展键值来实现，比如：`initAbc`。

在 `Mobo` 初始化和子上下文初始化时，可以得到准确的类型提示。然后，上下文初始化时，也会调用所有插件里的初始化函数，以分治的方式完成。

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

## 自定义插件类型

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

## 自定义插件高等类型

感谢 [free-types](https://github.com/geoffreytools/free-types).

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

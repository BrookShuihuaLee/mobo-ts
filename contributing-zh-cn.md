# 贡献

## 项目初始化

```sh
# 安装依赖
pnpm i
# 编译
pnpm build
```

## 脚本

| 脚本                    | 说明                                |
| ----------------------- | ----------------------------------- |
| build                   | 编译所有子包                        |
| build:mobo              | 编译主板子包（含依赖）              |
| dev                     | 开发所有子包                        |
| dev:mobo                | 开发主板子包（含依赖）              |
| lint                    | 全局运行 eslint，检查 ts/tsx 文件   |
| publish-npm             | 发布所有 npm 相关子包               |
| publish-npm:pre-release | 发布所有 npm 相关子包（预发布版本） |
| test                    | 针对所有子包运行单测                |
| test:w                  | 针对所有子包以 watch 模式运行单测   |

# NPM 发包

- 使用 [pnpm 集成的 changeset 命令](https://pnpm.io/zh/using-changesets)发包
- 所有包统一版本号
  - 即使只改了一个包，也要把所有包都发一遍
- 不需要发包的子包，在 `package.json` 里注明 `"private": true` 即可
- 手动发布步骤

  - 编译所有包：`pnpm build`
  - 运行所有单测，确保没有问题：`pnpm test`
  - 生成变更描述：`pnpm changeset`
    - changed/unchanged packages 选择所有
    - major、minor 修 bug 的时候不选，需要选的时候，选择所有
  - 根据变更描述生成 changelog 以及修改版本号：`pnpm changeset version`
  - 生成 commit：先执行 `git add -A` 再执行 `git cz` 或 `git commit`
  - 发布所有 npm 包：
    - 预发布版本：`pnpm publish-npm:pre-release`
    - 正式版本：`pnpm publish-npm`
  - 提交代码： `git push`

# Contributing to lesscode-custom-components

蓝鲸团队秉持开放的态度，欢迎志同道合的开发者一起贡献项目。在开始之前，请认真阅读以下指引。

## 代码协议

[MIT LICENSE](/LICENSE.txt) 为 lesscode-custom-components 的开源协议，任何人贡献的代码也会受此协议保护，贡献代码前也请明确是否可以接受该协议。

## 如何开始

想要贡献代码，建议请先参照已有文档。想提issue，请查找已存在或者相类似的 issue，从而保证不存在冗余。

## GIT提交规范

因不同团队不同的项目管理下会有不同的代码提交注释，规范化开源下对不同团队提交信息，做了不同的提交标记以规范化区分提交内容：

```
git commit -m '标记: 提交的概要注释 issue #1'
```

示例:

```shell
git commit -m 'feat: 添加 webpack5 服务 #1'
```

### 标记说明:

| 标记     | 说明                                   |
| -------- | -------------------------------------- |
| feature/feat  | 新功能开发                             |
| bug/fix/bugfix   | bug修复                                |
| refactor/perf | 重构代码/优化配置&参数/优化逻辑及功能 |
| test     | 添加单元测试用例相关                   |
| docs     | 添加文档                               |
| info     | 添加注释类信息                         |
| format   | 不修改业务逻辑下，仅做代码规范的格式化 |
| merge    | 仅做分支合并同步                       |
| depend   | 对工程的依赖进行增删改                 |
| chore    | 构建脚本、任务等相关代码                 |
| del    | 删除可能仍然有人用到的功能、API等破坏性动作               |


## Pull Request/Merge Request

如果你已经在处理现有的issue，对此已经有合理的解决方案，建议你在当前issue上进行回复，让蓝鲸团队或者其他开发者、使用者了解到你对该问题有兴趣，并取得了积极的进展，防止重复开发建设，避免人力浪费。蓝鲸团队抱着开放的态度，非常乐意与大家磋商解决方案，期待大家提交PR/MR。

提交建议修复的步骤：

* fork受到该issue影响的分支
* 创建你自己的修复分支
* 修复问题
* 更新文档（如需要）
* 编译成功
* review，通过后合并

对于issue的修复，蓝鲸团队希望一个PR/MR能涵盖所有相关的内容，包括但不限于代码，修复文档与使用说明。

## Issues

蓝鲸团队使用[issues](https://github.com/TencentBlueKing/lesscode-custom-components/issues)进行bugs追踪、特性追踪等。

当提交相关的bug时，请查找已存在或者相类似的issue，从而保证不存在冗余。

如果确认该bug是一个新的bug，提交时请包含以下的信息：

* 你所使用的操作系统信息
* 当前你使用的版本信息，例如 version，commitid
* 出现问题时，相关的日志输出
* 重现该问题的准确步骤

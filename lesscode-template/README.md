### Developer Guide

> 本文用于介绍使用当前通用组件模板来帮助开发完成使用一套 vue3 语法代码 构建出在vue3、vue2、lesscode vue2、lesscode vue3应用中都能应用的组件。

### 准备

- Nodejs >= 18.6 推荐大家使用 [nvm](https://github.com/nvm-sh/nvm) 来对nodejs 进行版本管理
- Vscode 安装对应插件 `eslint` `stylelint` `prettier` (用于代码检查和美化)

### 安装依赖

- 安装依赖

  ```
  nvm use // 已经安装使用 nvm 用户

  // pnpm
  pnpm i

  // npm
  npm i

  // yarn
  yarn
  ```

- Script 命令

  - dev 开发模式

  - build 生产构建

  - release 发布

  - prettier 美化代码

  - dts 生成dts类型文件

  - visualize 分析构建产物

### 如何开发通用组件

> 当前模板是蓝鲸前端通用组件 [@blueking/date-piker](https://www.npmjs.com/package/@blueking/date-picker) 完整的代码及最佳实践。在开发时可以借鉴这个组件的开发形式（如：vue2组件的实现、构建中的通用依赖、vue2组件样式隔离等等）来快速开发自己的组件。

​

- 如模板中一样，在 src 目录下使用 vue3 语法来实现自己的组件功能。

- 模板中默认 src/vue3.ts 是vue3组件的入口 这里默认导出你的开发的组件

- 模板中默认 src/vue2.ts 则是组件在vue2中使用的默认入口，因为vue3组件并不能直接在vue2中使用 这里需要你做一层简单的转换

- 如模板中 src/vue2.ts 文件中一样 只需要在把 组件中的 props 和 event 转换为一个 vue2 中识别的组件形式就可以了, 原理很简单就是在vue2应用中使用这个vue3组件的时候 通过 vue3 createApp 挂载到一个dom中而已，这里大家可以在浏览器的vue devtools扩展中看到对应的 app, vue2转换 示例如下

  ```
  // @ts-nocheck
  import { createApp, h } from 'vue';

  import { DatePicker } from './vue3';

  export default {
    beforeDestroy() {
      this.unWatchStack.forEach((unWatch: Function) => unWatch?.());
      this.app?.unmount();
    },
    created() {
      const props = this.$props;
      const emit = this.$emit.bind(this);
      let datePickerInstance;
      this.app = createApp({
        render() {
          datePickerInstance = this;
          return h(DatePicker, {
            behavior: this.behavior || props.behavior,
            commonUseList: this.commonUseList || props.commonUseList,
            disabled: this.disabled || props.disabled,
            format: this.format || props.format,
            modelValue: this.modelValue || props.modelValue,
            needTimezone: this.needTimezone || props.needTimezone,
            'onUpdate:modelValue'() {
              emit('update:modelValue', ...arguments);
              emit('change', ...arguments);
            },
            'onUpdate:timezone'() {
              emit('update:timezone', ...arguments);
              emit('timezoneChange', ...arguments);
            },
            ref: 'datePickerRef',
            timezone: this.timezone || props.timezone,
            version: this.version || props.version,
          });
        },
      });
      this.unWatchStack = Object.keys(this.$props).map(k => {
        return this.$watch(k, v => {
          datePickerInstance[k] = v;
          datePickerInstance.$forceUpdate();
        });
      });
    },
    data() {
      return {
        app: null,
        unWatchStack: [],
      };
    },
    methods: {
      handleHidePanel() {
        this.app?._instance?.refs?.datePickerRef?.handleHidePanel?.();
      },
      handleShowPanel() {
        this.app?._instance?.refs?.datePickerRef?.handleShowPanel?.();
      },
    },
    mounted() {
      this.app?.mount(this.$el);
    },
    name: 'DatePicker',
    props: {
      behavior: {
        default: 'normal',
        type: String,
        validate: (v: string) => ['normal', 'simplicity'].includes(v),
      },
      commonUseList: Array,
      disabled: {
        default: false,
        type: Boolean,
      },
      format: {
        default: 'YYYY-MM-DD HH:mm:ss',
        type: String,
      },
      modelValue: {
        default: () => [],
        type: Array,
      },
      needTimezone: {
        default: true,
        type: Boolean,
      },
      timezone: String,
      version: {
        default: 1,
        type: Number,
      },
    },
    render(createElement) {
      return createElement('div');
    },
  };
  ```

  **到目前为止您已经基本完成了一个既可以在vue3项目中也可以在vue2项目中使用的一个组件了**

### 如何开发 lesscode 自定义通用组件

> 蓝鲸lesscode 自定义组件相较于我们开发的普通的组件基本是一致的。不同的地方是
>
> 需要一个config.json来给到lesscode平台描述当前的这个组件的props、事件等
>
> 以及在构建产物上有部分不太一样 （如：iife 构建，需要zip包，external不一致等）

- 本项目的lesscode描述文件config.json 默认存放在 lesscode/config.json 路径下 具体的实际字段描述可以参考lesscode官方文档自定义组件章节。
- 按照您开发的组件的属性和事件编辑config.json后就可以 通过build构建即可以生产出对应的 lesscode 所需的zip 产物。
- 将生成好的lesscode自定义组件包，默认在 lesscode-dist目录下 会生成两个名称为 vue3 和 vue2的zip包 它们分别对应lesscode 平台vue3 和 vue2应用所对应的组件上传包
- 将这些包上传的lesscode 平台即可使用了

### 其他事项

- 构建中如何定义环境变量？

  ```
  项目中提供了 .env .env.production .env.development 文件来配置不同构建环境下的变量设置 并通过 vite 提供的 loadEnv api来获取值
  .env 是通用配置
  .env.production 生产环境配置
  .env.development dev环境配置

  注意：这些文件上的设置都必须同 vite 中 define来配置后才能在组件代码中获取到。同时ts类型的设置则需要配置在 src/vite-env.d.ts 中
  ```

- 如何在构建中配置公共依赖？

  ```
  当前项目中对于vue3 vue2 及 lesscode 产物中的依赖都做了不同的管理，而这些能力都是基于 vite 中的 exteranl 和 resolve来实现的。
  这些配置都在 script/vite.utils.ts 文件中体现，如果你的组件有公共的依赖并不需要构建到构建产物中可以参考这里的配置

  特别需要注意的是：
  1、lesscode的构建产物 iife 格式中如果lesscode并没有提供对应的全局依赖的情况下 则需要你把这个依赖打包进去。
  2、vue2组件有部分公共的一些依赖都会存放在 bkui-library 中，开发中可以先去查看 bkui-library 是否已经包含了你的依赖资源。
  ```

- 项目中如何使用通用组件？

  ```
  通用组件的导出和tds配置 都配置在了package.json 文件中 对应默认的设置如下
    "exports": {
      ".": {
        "types": "./typings/vue3.d.ts",
        "import": "./vue3/index.es.min.js",
        "default": "./vue3/index.es.min.js"
      },
      "./vue3": {
        "types": "./typings/vue3.d.ts",
        "import": "./vue3/index.es.min.js",
        "default": "./vue3/index.es.min.js"
      },
      "./vue2": {
        "types": "./typings/vue2.d.ts",
        "import": "./vue2/index.es.min.js",
        "default": "./vue2/index.es.min.js"
      },
      "./vue3/*": "./vue3/*",
      "./vue2/*": "./vue2/*"
    },
    "typesVersions": {
      "*": {
        ".": [
          "./typings/vue3.d.ts"
        ],
        "vue3": [
          "./typings/vue3.d.ts"
        ],
        "vue2": [
          "./typings/vue2.d.ts"
        ]
      }
    }
  只需要将你的组件发布到npm后即可在项目中使用了
  发布到npm: 通过模板预设的工具 执行 npm run release 发布到npm

  vue3项目中使用：
  import XXX fron 'xxx'
  import 'xxx/vue3/style.css'

  vue2项目中使用：
  import XXX fron 'xxx/vue2'
  import 'xxx/vue2/style.css'

  ```

## 开发提示

#### 技术栈

axios+[element-ui](https://element.eleme.cn/#/zh-CN)+[vue](https://cn.vuejs.org/)+mock



#### 目录结构

```sh
├── build                      # 构建相关
├── dist                       # 编译发布目录
├── mock                       # 项目mock 模拟数据
├── node_modules               # NPM包目录
├── public                     # 静态资源
│   │── favicon.ico            # favicon图标
│   └── index.html             # html模板
├── src                        # 源代码
│   ├── api                    # 所有请求
│   ├── assets                 # 主题 字体等静态资源
│   ├── components             # 全局公用组件
│   ├── icons                  # 项目所有 svg icons
│   ├── lang                   # 国际化 language
│   ├── layout                 # 全局 layout
│   ├── router                 # 路由
│   ├── store                  # 全局 store管理
│   ├── styles                 # 全局样式
│   ├── utils                  # 全局公用方法
│   ├── views                  # views 所有页面
│   ├── App.vue                # 入口页面
│   ├── main.js                # 入口文件 加载组件 初始化等
│   ├── permission.js          # 权限管理
│   └── settings.js            # 全局配置信息
├── .env.xxx                   # 环境变量配置
├── .eslintrc.js               # eslint 配置项
├── .babel.config.js           # babel-loader 配置
├── .travis.yml                # 自动化CI配置
├── .gitignore                 # git 配置项
├── .prettierrc                # prettier 配置项
├── jest.config.js             # jest 测试配置项
├── jsconfig.json              # js 根目录指定
├── vue.config.js              # vue-cli 配置(参照 https://cli.vuejs.org/)
├── postcss.config.js          # postcss 配置
└── package.json               # package.json
```


#### 模块开发步骤

1. 在 src/views/ 下增加页面文件 xxx.vue
2. 在 src/api/   下增加同名的   xxx.js
3. 在 src/router/index.js  中增加 xxx 的路由对象
4. 在 mock/      下增加同名文件 xxx.js 之后再 index.js 中增加

要求

1. 尽量在1个 xxx.vue 中完成某一个模块页面的开发
2. 开发过程中只修改 TODO 标识的部分内容
3. 如果确实需要 单独封装 组件 或是 公共 js 方法 建议在对应目录增加 新文件完成，避免代码冲突
4. mock文件会自动加载，修改以后就能调试完成页面功能
5. 3.16号的版本需要界面都能正常加载，后端接口可能还没完成，需要我们页面能够在没有后端的情况下正常打开
6. 提交git的时候注意只提交自己修改部分的文件

#### 开发指令

1. 安装环境

```bash
# install dependency
npm install
# develop
npm run dev
```

This will automatically open http://localhost:9528

2. 编译构建

```bash
# build for test environment
npm run build:stage
# build for production environment
npm run build:prod
```

3. 其他

```bash
# preview the release environment effect
npm run preview

# preview the release environment effect + static resource analysis
npm run preview -- --report

# code format check
npm run lint

# code format check and auto fix
npm run lint -- --fix
```

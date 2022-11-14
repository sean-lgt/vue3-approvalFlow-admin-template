# 基于 Vite+ Vue3 + ElementPlus+Koa2+Mongo 开发一个通用后台管理系统

## 项目结构
- 使用 tree-node-cli  `npm install -g tree-node-cli`
- 需要在 git bash 使用：`tree -L 3 -I "node_modules" > tree.txt`
- **不用在 cmd 上使用，会有错误**
```
├── README.md                 # 项目文档
├── auto-imports.d.ts         # 自定导入插件
├── commitlint.config.cjs     # commit 配置
├── components.d.ts
├── dist                      # 打包生成的文件目录
├── dist-server.js            # 使用node服务跑打包后的文件
├── index.html                # html模板文件
├── package-lock.json
├── package.json
├── public                    # 静态资源目录
│   └── vite.svg
├── src                       # 项目主要文件
│   ├── App.vue               # 根文件
│   ├── api                   # api 请求目录 
│   │   └── index.js
│   ├── assets                # 静态资源
│   │   ├── images
│   │   ├── logo.png
│   │   ├── style
│   │   └── vue.svg
│   ├── components              # 公共组件开发
│   │   ├── BreadCrumb.vue
│   │   ├── HelloWorld.vue
│   │   ├── Home.vue
│   │   ├── TreeMenu.vue
│   │   └── VInput.vue
│   ├── config                  # 项目相关配置
│   │   └── index.js
│   ├── main.js                 # 项目入口文件
│   ├── packages                # 封装高级组件
│   │   ├── BaseTable
│   │   └── QueryForm
│   ├── router                  # 路由
│   │   └── index.js
│   ├── store                   # vuex 全局状态管理
│   │   └── index.js
│   ├── style.css
│   ├── utils                   # 工具函数库，封装请求库
│   │   ├── request.js
│   │   ├── storage.js
│   │   └── utils.js
│   └── views                   # 视图
│       ├── Audit
│       ├── Home
│       ├── Login
│       ├── NotFound
│       └── System
└── vite.config.js          # vite 配置
```

# emcp-ui

> emcp ui.

## Build & Run

### Before Run

- 复制 `config 目录` 下的 `dev.proxy-table.js.example` 文件，并重命名为 `dev.proxy-table.js`；
- 如果您本地没有部署后端 JAVA 项目，在运行项目前，您可能需要修改以下配置：
  - `config/index.js` 中请切换 32/33行和40/41行的代理配置

### Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8010
npm run start

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run all tests
npm test
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

## 第三方依赖包说明

| 依赖包名         | 说明                       | 文档                                       |
| ------------ | ------------------------ | ---------------------------------------- |
| axios        | HTTP 请求模块，支持所有 HTTP 请求方法 | [GITHUB](https://github.com/mzabriskie/axios) [DEMO](https://github.com/mzabriskie/axios#example) |
| element-ui   | 饿了么 UI                   | [GITHUB](https://github.com/ElemeFE/element) [DOCS](http://element-cn.eleme.io/#/zh-CN/component/installation) |
| moment       | 时间格式化组件                  | [GITHUB](https://github.com/moment/moment) [DEMO](http://momentjs.com/) |
| v-chart      | 百度 ECharts 图表            | [GITHUB](https://github.com/ElemeFE/v-charts) [DOCS](https://elemefe.github.io/v-charts/#/) |
| v-distpicker | 省市区三级联动组件                | [GITHUB](https://github.com/jcc/v-distpicker) [DEMO](https://distpicker.iline.co/) |
| vue-awesome  | ICON 图标组件                | [GITHUB](https://github.com/Justineo/vue-awesome) [DEMO](https://justineo.github.io/vue-awesome/demo/) |
| vue-cookie   | Cookie 组件                | [GITHUB](https://github.com/alfhen/vue-cookie) [DEMO](https://github.com/alfhen/vue-cookie#example) |
| vue-count-to | 数字动态变化组件                 | [GITHUB](https://github.com/PanJiaChen/vue-countTo) [DEMO](https://github.com/PanJiaChen/vue-countTo#example) |

## 那堵墙

> 有一些依赖包因为墙的关系，无法下载，请配置好相关镜像，参考 https://npm.taobao.org/mirrors/

## 目录结构

> ├── build
> ├── config
> ├── docs                       // 相关文档
> ├── src                          // 源码
> │   ├── api                    // 数据 RESTful API
> │   ├── assets              // 主题、字体、样式等静态资源
> │   ├── components
> │   ├── filters                // js 数据过滤包
> │   ├── models                // 数据模型接口
> │   ├── router
> │   ├── store
> │   ├── utils                   // js 工具包
> │   ├── App.vue
> │   └── main.js
> ├── static                      // 第三方不打包资源
> ├── .babelrc
> ├── .editorconfig
> ├── .eslintignore
> ├── .eslintrc.js
> ├── .gitignore
> ├── index.html
> ├── package.json
> └── README.md            // 项目说明文件

## 规范

- [项目代码规范](docs/books/code-style.md)
- [书写规则](docs/books/write-sequence.md)
- [编辑器设置](docs/books/editor-setting.md)

## Question

 - [node-sass 运行异常](docs/question/node-sass-runtime-exception.md)

## 常用软件推荐

- 代码编辑器：[webstorm](https://www.jetbrains.com/webstorm/)
- Markdown 阅读编辑器：[Typora](http://typora.io/)

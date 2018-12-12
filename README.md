### 简介

无线产品部W1路由器配置管理页面。

#### 项目资料

设计稿：http://172.16.0.151:8070/pages/viewpage.action?pageId=917697

接口指令集：http://doc.sunmi.cn/docs/sunmiap/1240

### 技术栈

WEBPACK(v3) + React(v16) + React-router(v4) + Redux(v4) + Koa2 + SASS + Antd

### 目录结构
```sh
|- conf     // WEBPACK 配置文件  
|- dist     // 产出路径   
|- server   // koa2 编写的 mock server 脚本 
|- task     // 编译脚本文件
|- src      // 项目原始代码文件目录
    |- assets
        |- common
        |- styles
    |- components // 高复用业务组件列表
        |- Form
        |- icon
        |- Modal
        |- PanelHeader
        |- PrimaryHeader
        |- SubLayout
        |- Tips
        |- ...
    |- pages     // 路由+页面
        |- Guide // 快速设置页面及子页
        |- Home  // 首页
        |- Login // 登录页
        |- Settings // 基础设置及子页
    |- pub       
        |- ...   // redux
    |- app.js    // 项目入口文件
    |- context.js // React context
|- babelrc
|- debug.json 
|- index.template.html // 项目 html 模板文件
|- postcss.config.js   // postcss 配置文件
|- theme.js            // 自定义 antd 主题配置
|- utils.js
|- webpack.base.conf.js // WEBPACK 基础配置
|- webpack.prod.conf.js // WEBPACK 生产环境构建配置

```
### 路由设计

- 首页 `/`
- 登录页 `/login`
- 快速设置(引导页) `/guide`  
    - 设置密码 `/guide/setpassword`
    - wan 设置 `/guide/setwan`
    - QOS 测速 `/guide/speed`
    - wifi 设置 `/guide/setwifi`
- 基础设置 `/settings`
    - wifi 设置 `/settings/wifi`


### 开发说明
1. 开发人员自行安装 nodejs(≥v8)。
2. 执行编译自定义编译命令。完整命令集参考 `package.json`。

    ```sh
    $ npm run dev   // 本地起webpack-dev-server，开发调试使用 
    $ npm run build // 发布生产环境版本（源码已压缩）
    $ npm run dev:a // 本地起 webpack-dev-server 同时支持 bundle analyzer
    $ npm run build:a // 发布生产环境版本 同时支持 bundle analyzer
    $ npm run server  // 启动 mock server（koa2）
    $ npm run server:w  // 启动 mock server ，同时开启 watch 实时编译。
    ```

    > $npm run build 之后产出目录为 `/dist`， 只需使用 `/dist` 下的文件作为生产环境的正式版本。

#### H5页面开发

H5页面为后期新增需求，目录结构如下：

```sh
$ tree src/H5/
src/H5/
|-- assets
|   `-- styles
|       `-- normalize.useable.scss	// 重置浏览器样式（手动加卸载）
|-- components		// 组件
|   |-- Button
|   |   |-- button.scss
|   |   `-- index.jsx
|   `-- Icon
|       `-- index.jsx
|-- index.js
`-- pages			// 功能页面
    |-- Home
    |   |-- home.scss
    |   `-- index.jsx
    `-- Welcome
        `-- index.jsx
```

H5页面开发之前你需要了解H5页面开发知识（`viewport`、`flexible`等）。开发中尺寸单位**必须**使用`rem`（极少数特殊情况除外）。

使用rem单位时，因为设计稿尺寸单位为px，需要将px转成rem，用一个换算过程。如果你使用vscode的话，可以安装`px to rem`这个插件来帮我们自动换算，使用方法：

1. 安装`px to rem`；
2. 设置换算单位，方法为依次点击：`文件` --> `首选项` --> `设置`，然后搜索`px-to-rem.px-per-rem`，点击其左侧编辑按钮，设置成`75`（这个75和我们设计稿基于哪个机型相关）。
3. 设置好后，后续在写CSS时，直接按照设计稿尺寸填写“xxx px”，选中（或者全选）然后按住`Alt+Z`将其自动换算成rem。

开发中**强制显示H5、PC Web页面方法**：

```javascript
// 在chrome控制台输入如下命令

// 1.显示H5页面
sessionStorage.setItem("__PAGE_STYLE__", 'H5');
window.location.href = "/";

// 2.显示PC Web页面
sessionStorage.setItem("__PAGE_STYLE__", 'WEB');
window.location.href = "/";
```


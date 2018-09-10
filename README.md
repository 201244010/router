
### 技术栈
WEBPACK(v3) + React(v16) + React-router(v4) + Redux(v4) + Koa2 + SASS + Antd

### 目录结构
```
|- conf     // WEBPACK 配置文件  
|- dist     // 产出路径   
|- server   // koa2 编写的 mock server 脚本 
|- task     // 编译脚本文件
|- src      // 项目原始代码文件目录
    |- assets
        |- common
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


### 开发说明：
1. 开发人员自行安装 nodejs(≥v8)。
2. 执行编译自定义编译命令。完整命令集参考 `package.json`。

    ```
    $ npm run dev   // 本地起webpack-dev-server，开发调试使用 
    $ npm run build // 发布生产环境版本（源码已压缩）
    $ npm run dev:a // 本地起 webpack-dev-server 同时支持 bundle analyzer
    $ npm run build:a // 发布生产环境版本 同时支持 bundle analyzer
    $ npm run server  // 启动 mock server（koa2） 
    $ npm run server:w  // 启动 mock server ，同时开启 watch 实时编译。

    ```
    
    > $npm run build 之后产出目录为 `/dist`， 只需使用 `/dist` 下的文件作为生产环境的正式版本。
   

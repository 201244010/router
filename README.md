
### 技术栈
WEBPACK(v3) + React(v16) + React-router(v4) + Redux(v4) + Koa2

### 目录结构
...

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
   

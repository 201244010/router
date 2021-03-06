const path =  require("path");
const fs = require('fs');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

let cssLoaders, styleLoaders;

function pad(n) {
    return n < 10 ? "0" + n.toString(10) : n.toString(10);
}

function timestamp() {
    const d = new Date();
    const time = [ pad(d.getHours()), pad(d.getMinutes()), pad(d.getSeconds()) ].join(":"); 
    return `[${time}]`;
}

function resolve(...dirs) {
    return path.join(__dirname, ...dirs);
}

exports.timestamp = timestamp;
exports.resolve = resolve;

exports.cssLoaders = cssLoaders = function(options = {}) {
    let sourceMap = options.sourceMap || false;
    let minimize = options.minimize || false;
    let forVue = options.forVue || false;

    options = Object.assign({ minimize, sourceMap }, options);
    
    let cssLoader = { loader: "css-loader", options };

    /**
     * generate loader string to be used with extract text plugin
     * @return 
     * if extract = true
     *    ExtractTextPlugin.extract({
     *          use: [
     *            {'loader' : "css-loader", options : loaderOptions},
     *            {'loader' : "loader-by-you-pass", options : {option-by-you-pass}}
     *          ],
     *          fallback: "vue-style-loader"
     *    }); 
     * else 
     *    [
     *      "vue-style-loader", 
     *      {'loader' : "css-loader", options : loaderOptions}, 
     *      {'loader' : "loader-by-you-pass", options : {option-by-you-pass}}
     *    ]
     * 
     */
    
    function generateLoaders(loader, loaderOptions, forVue = false) {
        const loaders = [cssLoader];
        const vueLoader = forVue ? "vue-style-loader" : "style-loader";

        if (loader) {
            loaders.push({
                loader: loader + "-loader",
                options: Object.assign({}, loaderOptions, {
                    sourceMap
                })
            });
        }

        // Extract CSS when that option is specified
        // (which is the case during production build)
        if (options.extract) {
            return ExtractTextPlugin.extract({
                use: loaders,
                fallback: vueLoader
            });
        } else {
            return [vueLoader].concat(loaders);
        }
    }

    // https://vue-loader.vuejs.org/en/configurations/extract-css.html
    return {
        css: generateLoaders("", "", forVue),
        sass: generateLoaders("sass", options, forVue),
        less : generateLoaders("less", options, forVue),
        scss: generateLoaders("sass", options, forVue)
    };
}

/**
 * Generate loaders for standalone style files (outside of .vue)
 * ...
 * module : {
 *    rules : [
 *      ...
 *      { test : /.css$/, use : ['postcss-loader', ...]},
 *      { test : /.scss$/, use : ['postcss-loader', ...]},
 *      { test : /.less$/, use : ['postcss-loader', ...]},
 *      { test : /.sass$/, use : ['postcss-loader', ...]},
 *      ...
 *    ]
 * }
 * ...
 */
exports.styleLoaders = styleLoaders = function (options = {}, forVue = false) {
    const output = [];
    //exports.cssLoaders ===cssLoaders :true
    const loaders = cssLoaders(options, forVue);
    const index = options.extract === true ? 3 : 2;
    for (let extension in loaders) {
        let loader = loaders[extension];
        //console.log(extension);
        output.push({
            test: new RegExp("\\." + extension + "$"),
            exclude: new RegExp("\\.useable\." + extension + "$"),
            //在index:1位置插入'postcss-loader'
            use: (loader.splice(index, 0, "postcss-loader"), loader)
        });
        //console.log(loader);

        /**
         * 实现样式手动加载/卸载功能
         * 背景：
         *      我们有PC Web页面和H5页面，react直接import样式会造成组件间样式互相影响、冲突
         * 解决方案：
         *      使用style-loader/useable在组件中手动加载、卸载样式。
         *      原理详见 https://www.npmjs.com/package/style-loader Useable章节
         * 使用方法：
         *      1.import样式：import style from "xxx/style.useable.scss";
         *      2.在组件Mount时加载样式：style.use();
         *      3.在组件卸载时卸载样式： style.unuse();
         * 详见示例：
         *      src/web.js
         */
        let uaeableLoader = [...loader];
        const styleLoaderIdx = options.extract === true ? 1 : 0;
         output.push({
            test: new RegExp("\\.useable\." + extension + "$"),
            exclude: /node_modules/,
            //替换 style-loader 为 style-loader/useable
            use: (uaeableLoader.splice(styleLoaderIdx, 1, { loader: "style-loader/useable" }), uaeableLoader)
        });
         //console.log(uaeableLoader);
    }

    //console.log(output);
    return output;
}


exports.print = (json)=>{
    json = typeof json === 'string' ? json : JSON.stringify(json, null, 4);
    fs.writeFile(".debug.json", json, function(err){
        if(err) return console.error(err);
    })
};
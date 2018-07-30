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
    const sourceMap = options.sourceMap || false;
    const minimize = options.minimize || false;
    const forVue = options.forVue || false;
    const cssLoader = {
        loader: "css-loader",
        options: {
          minimize,
          sourceMap
        }
    };

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
        sass: generateLoaders("sass", { indentedSyntax: false }, forVue),
        less : generateLoaders("less", {}, forVue),
        scss: generateLoaders("sass", forVue)
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
        output.push({
            test: new RegExp("\\." + extension + "$"),
            //在index:1位置插入'postcss-loader'
            use: (loader.splice(index, 0, "postcss-loader"), loader)
        });
    }
    return output;
}


exports.print = (json)=>{
    json = typeof json === 'string' ? json : JSON.stringify(json, null, 4);
    fs.writeFile(".debug.json", json, function(err){
        if(err) return console.error(err);
    })
};
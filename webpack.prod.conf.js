
const webpack = require('webpack');
const merge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const utils = require('./utils');
const chalk = require("chalk");
const theme = require('./theme');

let styleLoaders = utils.styleLoaders({
    extract : false,
    minimize : true,
    modifyVars : theme,
    javascriptEnabled: true
});

let plugins = [
    new ProgressBarPlugin({
        format: 'build [:bar] ' + chalk.green.bold(':percent') + ' (:elapsed seconds)',
        clear: true
    }),
    // 编译时(compile time)插件
    new webpack.DefinePlugin({
      'process.env.NODE_ENV':  JSON.stringify('production'),
      __BASEAPI__ : JSON.stringify('/api')
    }),
    // 提取样式表
    // new ExtractTextPlugin({
    //     filename: '[name].min.css',
    //     allChunks: true
    // }),
    // 压缩代码
    new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false,
            drop_console: false,
        }
    })
];

const conf = merge(require('./webpack.base.conf'), {
    module : { rules : styleLoaders },
    devtool : false,
    watch: true,
    plugins
});

module.exports = conf;





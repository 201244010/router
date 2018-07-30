
const webpack = require('webpack');
const merge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const argv = require('minimist')(process.argv.slice(2));
const utils = require('./utils');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const chalk = require("chalk");
const theme = require('./theme');

let styleLoaders = utils.styleLoaders({extract : true, minimize : true, modifyVars : JSON.stringify(theme)});

let plugins = [
    new ProgressBarPlugin({
        format: 'build [:bar] ' + chalk.green.bold(':percent') + ' (:elapsed seconds)',
        clear: true
    }),
    // 编译时(compile time)插件
    new webpack.DefinePlugin({
      'process.env.NODE_ENV':  JSON.stringify('production')
    }),
    // 提取样式表
    new ExtractTextPlugin({
        filename: '[name].min.css',
        allChunks: true
    }),
    // 压缩代码
    new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false,
            drop_console: false,
        }
    })
];

if(argv.analysis){
    plugins.unshift(new BundleAnalyzerPlugin({
        analyzerPort : 8888
    }));
}

const conf = merge(require('./webpack.base.conf'), {
    module : { rules : styleLoaders },
    devtool : false,
    plugins
});

module.exports = conf;





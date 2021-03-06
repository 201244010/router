const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CopyWebpackPlugin = require('copy-webpack-plugin');
const argv = require('minimist')(process.argv.slice(2));
const theme = require('./theme');
const resolve = args => path.resolve(__dirname, args);
const conf = require('./conf');

const options = {
    entry: {main: resolve('./src/app')},
    // devtool : "inline-cheap-module-source-map",
    devtool: "cheap-module-eval-source-map",
    output: {
        path: resolve('dist'),
        filename: '[name].[hash].min.js',
        publicPath: "/"
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: "babel-loader",
                options: {compact: false, cacheDirectory: true}
            },
            {
                test: /\.(png|jpg|gif|woff|woff2|ttf|eot|svg|swf)$/,
                loader: "file-loader",
                options: {
                    name: "[name].[hash].[ext]"
                }
            }
        ]
    },
    resolve: {
        alias: conf.alias,
        extensions: [".js", ".jsx", ".css", ".scss", ".json"]
    },
    plugins: [
        new webpack.ProvidePlugin(conf.provide),
        // 构建优化插件
        new webpack.optimize.CommonsChunkPlugin({
            name: "vendor",
            minChunks: function (module) {
                return module.context && module.context.includes("node_modules");
            }
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: "manifest",
            minChunks: Infinity
        }),
        new HtmlWebpackPlugin({
            template: resolve('index.template.html'),
            inject: true
        }),
        new CopyWebpackPlugin(
            [
                {
                    from: __dirname + '/src/assets/static',
                    to: __dirname + '/dist/'
                },
                {
                    from: __dirname + '/others/common',
                    to: __dirname + '/dist/common'
                },
                {
                    from: __dirname + '/others/portal',
                    to: __dirname + '/dist/portal'
                },
                // {
                //     from: __dirname + '/others/mobile',
                //     to: __dirname + '/dist/mobile'
                // },
                {
                    from: __dirname + '/others/agreement',
                    to: __dirname + '/dist/agreement'
                }
            ]
        )
        // new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
    ]
};

if (argv.analysis) {
    options.plugins.unshift(new BundleAnalyzerPlugin());
}

module.exports = options;



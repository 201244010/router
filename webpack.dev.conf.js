const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const resolve = args => path.resolve(__dirname, args);

module.exports = {
  output : {
    path : resolve('dist'),
    filename : '[name].min.js'
  },
  plugins: [
    // 编译时(compile time)插件
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    // 构建优化插件
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'vendor.min.js',
    }),
    new HtmlWebpackPlugin({
      template : resolve('index.template.html'),
      inject : true
    }),
    new ExtractTextPlugin({
      filename: '[name].min.css',
      allChunks: true
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
  ]
};



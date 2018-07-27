const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const resolve = args => path.resolve(__dirname, args);
const conf = require('./conf');

module.exports = {
  entry : { main : resolve('./src/app') },
  devtool : "inline-cheap-module-source-map",
  output : {
    path : resolve('dist'),
    filename : '[name].min.js'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: { compact: false, cacheDirectory: true }
      },
      {
        test: /\.(png|jpg|gif|woff|woff2|ttf|eot|svg|swf)$/,
        loader: "file-loader",
        options: {
          name: "[name]_[sha512:hash:base64:7].[ext]"
        }
      }
    ]
  },
  resolve : {
    alias : conf.alias,
    extensions: [".js", ".jsx", ".css", ".scss", ".json"]
  },
  plugins: [
    new webpack.ProvidePlugin(conf.provide),
    // 构建优化插件
    new webpack.optimize.CommonsChunkPlugin({
      name: "vendor",
      minChunks: function(module){
        return module.context && module.context.includes("node_modules");
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: "manifest",
      minChunks: Infinity
    }),
    
    new HtmlWebpackPlugin({
      template : resolve('index.template.html'),
      inject : true
    })
    // new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
  ]
};



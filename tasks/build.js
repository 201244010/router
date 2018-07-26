
const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const merge = require('webpack-merge');
const utils = require('../utils');

const styleLoaders = utils.styleLoaders({extract : true, minimize : true});

let conf = merge(require('../webpack.base.conf'), {
    module : {
        rules : styleLoaders
    },
    plugins : [
        new ExtractTextPlugin({
            filename: '[name].min.css',
            allChunks: true
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                drop_console: false,
            }
        })
    ]
});
// fs.writeFileSync('./debug.json', JSON.stringify(conf, null, 4));

webpack(conf, function(err, stats) {
  if (err) {
      return console.error(err);
  }
  console.log(
      stats.toString({
          colors: true,
          hash: true,
          version: false,
          timings: false,
          assets: true, //true
          chunks: true, //true
          modules: true, //true
          chunkModules: false,
          children: false,
          errorDetails: true
      })
  );

  if (stats.hasErrors() || stats.hasWarnings()) {
      return console.log("编译过程有错误或者警告");
  }
  console.log("构建完成");
});














const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const conf = require('../webpack.prod.conf');

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














const webpack = require('webpack');
const middleWare = require('webpack-dev-middleware');
const history = require("connect-history-api-fallback");
const merge = require('webpack-merge');
const express = require('express');
const utils = require('../utils');
const styleLoaders = utils.styleLoaders({extract : false, sourceMap : true});

const app = express();
const port = 3003;

console.time('编译耗时');

let conf = merge(require('../webpack.base.conf'), {
  module : {
    rules : styleLoaders
  }
});
let compiler = webpack(conf);

app.use(history({
  index: '/index.html',
  verbose: false
}));

app.use(middleWare(compiler, {
  logLevel : 'silent'
}));

app.listen(port, function() {
  console.log('dev-server wake up, open %s', "http://localhost:" + port);
  console.timeEnd('编译耗时');
})












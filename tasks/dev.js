
const webpack = require('webpack');
const middleWare = require('webpack-dev-middleware');
const merge = require('webpack-merge');
const express = require('express');
const utils = require('../utils');
const styleLoaders = utils.styleLoaders({extract : false, sourceMap : true});
const app = express();
const port = 3003;

let conf = merge(require('../webpack.base.conf'), {
  module : {
    rules : styleLoaders
  }
});
let compiler = webpack(conf);

app.use(middleWare(compiler, {
  logLevel : 'silent'
}));

app.listen(port, function() {
  console.log('dev-server wake up, open %s', "http://localhost:" + port);
})












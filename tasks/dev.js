const webpack = require('webpack');
const devServer = require('webpack-dev-server');
const merge = require('webpack-merge');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const chalk = require("chalk");
const utils = require('../utils');
const theme = require('../theme');

let styleLoaders = utils.styleLoaders({
    extract: false,
    sourceMap: true, 
    modifyVars : theme,
    javascriptEnabled: true
});

const port = 3004;

const conf = merge(require('../webpack.base.conf'), {
  module: {
    rules: styleLoaders
  },
  plugins: [
    new ProgressBarPlugin({
      format: 'build [:bar] ' + chalk.green.bold(':percent') + ' (:elapsed seconds)',
      clear: true,
      callback: function () {
        console.log('dev-server wake up, open %s', "http://localhost:" + port);
      }
    }),
    // 编译时(compile time)插件
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
      __BASEAPI__ : JSON.stringify('http://localhost:3000/api')
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ]
});


utils.print(conf);

const options = {
  // Tell the server where to serve content from
  // contentBase: path.resolve(__dirname, '..', 'dist'),
  contentBase: "/dist",
  // Enable webpack's Hot Module Replacement feature:
  hot: true,
  // Enable gzip compression for everything served
  compress: true,
  // Specify a host to use. By default this is localhost
  host: 'localhost',
  // When using the HTML5 History API, the index.html page will likely have to be served in place of any 404 responses
  historyApiFallback: true,
  // When open is enabled, the dev server will open the browser.
  open: true,
  // With noInfo enabled, messages like the webpack bundle information that is shown when starting up and after each save, will be hidden. Errors and warnings will still be shown.
  noInfo: true
};

devServer.addDevServerEntrypoints(conf, options);

const compiler = webpack(conf);
const server = new devServer(compiler, options);


server.listen(port, "localhost", function () {
  // console.log('dev-server wake up, open %s', "http://localhost:" + port);
})

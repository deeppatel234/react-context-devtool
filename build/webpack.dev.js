const merge = require('webpack-merge');

const common = require('./webpack.common.js');

const PORT = 8090;

module.exports = merge(common, {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  devServer: {
    port: PORT,
  },
});

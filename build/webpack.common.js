const webpack = require('webpack');
const PATHS = require('./paths');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const { EXTENSIONS_DIR, DIST_DIR } = require('./paths');
const pkg = require('../package.json');

module.exports = {
  entry: {
    'chrome/devpanel/devpanel': `${PATHS.SRC_DIR}/devpanel.index.js`,
    'chrome/popup/popup': `${PATHS.SRC_DIR}/popup.index.js`,
  },
  output: {
    path: PATHS.DIST_DIR,
    filename: '[name].js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: PATHS.SRC_DIR,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.svg$/,
        loader: 'svg-inline-loader',
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.js'],
    alias: {
      Components: PATHS.COMPONENTS,
      Utilities: PATHS.UTILITIES,
      Src: PATHS.SRC_DIR,
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      PACKAGE_VERSION: JSON.stringify(pkg.version),
    }),
    new CopyPlugin([
      { from: EXTENSIONS_DIR, to: DIST_DIR },
    ]),
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
  ],
};

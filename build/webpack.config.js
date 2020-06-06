const webpack = require('webpack');
const PATHS = require('./paths');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const pkg = require('../package.json');

module.exports = ({
  mode = "production",
  distPath,
}) => {

  return {
    mode,
    entry: {
      'injectGlobalHook': `${PATHS.EXTENSION_DIR}/core/injectGlobalHook.js`,
      'helper': `${PATHS.EXTENSION_DIR}/core/helper.js`,
      'devtool/devpanel': `${PATHS.SRC_DIR}/devpanel.index.js`,
      'popup/popup': `${PATHS.SRC_DIR}/popup.index.js`,
    },
    output: {
      path: distPath,
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
      new MiniCssExtractPlugin({
        filename: '[name].css',
      }),
    ],
  }
}

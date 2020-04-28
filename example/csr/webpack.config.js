const path = require('path');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const PUBLIC_DIR = path.resolve(__dirname, './public');
const DIST_DIR = path.resolve(__dirname, './dist');
const CLIENT_DIR = path.resolve(__dirname, './src');

const PORT = 8090;

module.exports = {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  entry: {
    app: `${CLIENT_DIR}/index.js`,
  },
  output: {
    path: DIST_DIR,
    filename: 'bundles/[name].[hash:8].js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: CLIENT_DIR,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.(css)$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.js'],
  },
  devServer: {
    port: PORT,
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: `${DIST_DIR}/index.html`,
      template: `${PUBLIC_DIR}/index.html`,
    }),
    new MiniCssExtractPlugin(),
  ],
};

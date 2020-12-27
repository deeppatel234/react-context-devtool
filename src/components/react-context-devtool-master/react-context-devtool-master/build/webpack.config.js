const path = require("path");

const webpack = require("webpack");
const PATHS = require("./paths");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const pkg = require("../package.json");

module.exports = ({ mode, distPath } = {}) => {
  if (!distPath && process.env.DEV_FOR) {
    distPath = path.resolve(PATHS.DIST_DIR, process.env.DEV_FOR, "unpacked");
  }

  const isDevelopment = mode === "development";

  return {
    mode,
    devtool: isDevelopment ? "cheap-module-source-map" : false,
    entry: {
      injectGlobalHook: `${PATHS.EXTENSION_DIR}/core/injectGlobalHook.js`,
      "react-context-devtool-helper": `${PATHS.EXTENSION_DIR}/core/helper.js`,
      "devtool/devpanel": `${PATHS.SRC_DIR}/devpanel.index.js`,
      "popup/popup": `${PATHS.SRC_DIR}/popup.index.js`,
    },
    output: {
      path: distPath,
      filename: "[name].js",
      publicPath: "/",
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          include: PATHS.SRC_DIR,
          exclude: /node_modules/,
          loader: "babel-loader",
        },
        {
          test: /\.svg$/,
          loader: "svg-inline-loader",
        },
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                hmr: isDevelopment,
              },
            },
            {
              loader: 'css-loader',
              options: { url: false }
            },
            // {
            //   loader: "postcss-loader",
            //   options: {
            //     ident: "postcss",
            //     plugins: () => [
            //       require("postcss-flexbugs-fixes"),
            //       require("postcss-preset-env")({
            //         stage: 3,
            //       }),
            //       require("postcss-normalize"),
            //     ],
            //   },
            // },
            "sass-loader",
          ],
        },
      ],
    },
    resolve: {
      extensions: [".js"],
      alias: {
        Components: PATHS.COMPONENTS,
        Utils: PATHS.UTILS,
        Src: PATHS.SRC_DIR,
        Containers: PATHS.CONTAINERS,
      },
    },
    plugins: [
      new webpack.DefinePlugin({
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        PACKAGE_VERSION: JSON.stringify(pkg.version),
      }),
      new MiniCssExtractPlugin({
        filename: "[name].css",
      }),
    ],
  };
};

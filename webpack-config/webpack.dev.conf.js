const webpack = require("webpack");
const path = require("path");
const { merge } = require("webpack-merge");
const baseWebpackConfig = require("./webpack.base.conf");
const PATHS = {
  src: path.join(__dirname, "../_source"),
  dist: path.join(__dirname, "../_assets"),
  assets: "assets/",
};
const devWebpackConfig = merge(baseWebpackConfig, {
  mode: "development",
  devtool: "cheap-module-eval-source-map",
  output: {
    filename: `${PATHS.assets}js/[name].js`,
    path: PATHS.dist,
    publicPath: "",
  },
  devServer: {
    contentBase: baseWebpackConfig.externals.paths.dist,
    port: 8081,
    overlay: {
      warnings: true,
      errors: true,
    },
  },

  plugins: [
    new webpack.SourceMapDevToolPlugin({
      filename: "[file].map",
    }),
  ],
});

module.exports = new Promise((resolve, reject) => {
  resolve(devWebpackConfig);
});

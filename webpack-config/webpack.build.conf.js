const { merge } = require("webpack-merge");
const path = require("path");
const baseWebpackConfig = require("./webpack.base.conf");
const PATHS = {
  src: path.join(__dirname, "../_source"),
  dist: path.join(__dirname, "../_assets"),
  assets: "assets/",
};
const buildWebpackConfig = merge(baseWebpackConfig, {
  mode: "production",
  output: {
    filename: `${PATHS.assets}[name].js`,
    path: PATHS.dist,
    publicPath: "",
  },
});

module.exports = new Promise((resolve, reject) => {
  resolve(buildWebpackConfig);
});

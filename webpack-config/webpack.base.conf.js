const path = require("path");
const fs = require("fs");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const PATHS = {
  src: path.join(__dirname, "../_source"),
  dist: path.join(__dirname, "../_assets"),
  assets: "assets/",
};
const PAGES_DIR = `${PATHS.src}/pug/pages/`;
const PAGES = fs
  .readdirSync(PAGES_DIR)
  .filter((fileName) => fileName.endsWith(".pug"));

module.exports = {
  externals: {
    paths: PATHS,
  },
  entry: {
    index: [
      "babel-polyfill",
      `${PATHS.src}/js/`,
      `${PATHS.src}/css/base/base.scss`,
    ],
  },
  resolve: {
    alias: {},
  },
  module: {
    rules: [
      {
        test: /\.pug$/,
        oneOf: [
          // this applies to <template lang="pug"> in Vue components
          {
            resourceQuery: /^\?vue/,
            use: ["pug-plain-loader"],
          },
          // this applies to pug imports inside JavaScript
          {
            use: ["pug-loader"],
          },
        ],
      },
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: "/node_modules/",
      },
      {
        test: /\.vue$/,
        loader: "vue-loader",
        options: {
          loader: {
            scss: [
              "vue-style-loader",
              MiniCssExtractPlugin.loader,
              {
                loader: "css-loader",
                options: {
                  sourceMap: true,
                },
              },
              {
                loader: "postcss-loader",
                options: {
                  sourceMap: true,
                  config: {
                    path: "postcss.config.js",
                  },
                },
              },
              {
                loader: "sass-loader",
                options: {
                  sourceMap: true,
                },
              },
            ],
          },
        },
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        exclude: /(images|img|image)/,
        loader: "file-loader",
        options: {
          name: "[name].[ext]",
          outputPath: "assets/font/",
          publicPath: "../font/",
        },
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: "file-loader",
        exclude: /(fonts|font)/,
        options: {
          name: "[name].[ext]",
          outputPath: "assets/img/",
          publicPath: "../img/",
        },
      },
      {
        test: /\.scss$/,
        use: [
          "style-loader",
          {
            loader: MiniCssExtractPlugin.loader,
            options: {},
          },
          {
            loader: "css-loader",
            options: {
              sourceMap: true,
            },
          },
          {
            loader: "postcss-loader",
            options: {
              sourceMap: true,
              config: {
                path: "postcss.config.js",
              },
            },
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: true,
            },
          },
          {
            loader: "sass-resources-loader",
            options: {
              resources: `${PATHS.src}/css/base/vars.scss`,
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              sourceMap: true,
            },
          },
          {
            loader: "postcss-loader",
            options: {
              sourceMap: true,
              config: {
                path: `./postcss.config.js`,
              },
            },
          },
        ],
      },
    ],
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: `${PATHS.assets}/css/[name].css`,
      chunkFilename: "[id].css",
    }),

    new CopyWebpackPlugin({
      patterns: [
        // {
        //   from: `${PATHS.src}/img`,
        //   to: `${PATHS.assets}img/`,
        // },
        // {
        //   from: `${PATHS.src}/font`,
        //   to: `${PATHS.assets}font`,
        // },
        {
          from: `${PATHS.src}/favicon`,
          to: ``,
        },
      ],
    }),
    ...PAGES.map(
      (page) =>
        new HtmlWebpackPlugin({
          template: `${PAGES_DIR}/${page}`,
          filename: `./${page.replace(/\.pug/, ".html")}`,
        })
    ),
  ],
};

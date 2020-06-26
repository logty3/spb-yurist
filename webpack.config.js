const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");
const NodemonPlugin = require("nodemon-webpack-plugin");

module.exports = {
  entry: "./dev/javascript/",
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "javascript/script.js",
  },
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/,
        use: [
          "style-loader",
          MiniCssExtractPlugin.loader,
          "css-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.css$/,
        use: ["style-loader", MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
  plugins: [
    new NodemonPlugin({
      script: "./app.js",
      watch: ["./app_server", "./utils", "./app_api", "./config", "./app.js"],
      ext: "js",
    }),
    new MiniCssExtractPlugin({ filename: "stylesheets/styles.css" }),
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ["./javascript/*", "./stylesheets/*"],
    }),
  ],
};

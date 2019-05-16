const HtmlWebPackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: "./src/index.component.jsx",
    output: {
      filename: "bundle.js",
      path: __dirname + "/build"
    },

    module: {
      rules: [{
        exclude: /node_modules/,
        loader: "babel-loader",
        test: /\.(js|jsx)$/,
      }, ]
    },

    plugins: [
      new HtmlWebPackPlugin({
        template: "./public/index.html",
        filename: "./index.html",
        minify: {
          collapseWhitespace: true,
          removeComments: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          useShortDoctype: true
        }
      })]
    };
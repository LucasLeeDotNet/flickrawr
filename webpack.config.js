const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebPackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.component.tsx",
  output: {
    filename: "bundle.js",
    path: __dirname + "/build"
  },

  resolve: {
      extensions: [".ts", ".tsx", ".js", ".json"]
  },

  module: {
    rules: [{
        exclude: /node_modules/,
        loader: "babel-loader",
        test: /\.(js|jsx)$/,
      },
      {
        exclude: /node_modules/,
        loader: "ts-loader",
        test: /\.(ts|tsx)$/
      },
    ]
  },

  plugins: [
    new CopyPlugin([
      { from: "public", to: "", ignore: [ "index.html" ] },
    ]),
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
    })
  ],

  devServer: {
    proxy: {
      '/services/rest': {
        changeOrigin: true,
        target: 'https://api.flickr.com/',
        secure: false
      }
    }
  }
};
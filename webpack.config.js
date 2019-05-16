module.exports = {
  entry: "./src/index.component.jsx",
  output: {
      filename: "bundle.js",
      path: __dirname + "/build"
  },
  module: {
      rules: [
          { 
            exclude: /node_modules/,
            loader: "babel-loader",
            test: /\.(js|jsx)$/,  
          },
      ]
  },
};
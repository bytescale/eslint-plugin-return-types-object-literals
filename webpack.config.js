/* eslint @typescript-eslint/no-var-requires: 0 */
const path = require("path");

const isProduction = false;

module.exports = {
  entry: "./src/index.ts",
  output: {
    libraryTarget: "commonjs2"
  },
  mode: isProduction ? "production" : "development",
  devtool: false,
  stats: "minimal",
  plugins: [],
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
    alias: {
    }
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "babel-loader" // Options are in 'babel.config.js'
          },
          {
            loader: "ts-loader"
          }
        ],
        include: [path.resolve(__dirname, "src")]
      }
    ]
  }
};

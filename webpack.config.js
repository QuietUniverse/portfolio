const path = require("path");

module.exports = {
  entry: "./src/js/controller.js",

  output: {
    filename: "main.js",
    path: path.resolve("./dist"),
  },

  mode: "production",
  watch: false,

  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(?:js|mjs|cjs)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [["@babel/preset-env", { targets: "defaults" }]],
          },
        },
      },
    ],
  },
};

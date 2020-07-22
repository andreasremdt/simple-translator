const path = require('path');

module.exports = {
  mode: 'development',

  entry: './src/translator.js',

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'translator.js',
    library: 'Translator',
    libraryTarget: 'umd',
    libraryExport: 'default',
    umdNamedDefine: true,
  },

  devtool: 'source-map',

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|dist)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
};

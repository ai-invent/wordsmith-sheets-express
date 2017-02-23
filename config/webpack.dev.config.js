require('dotenv').config();

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  devtool: 'eval-source-map',
  entry: [
    'webpack-hot-middleware/client?reload=true',
    path.join(__dirname, '/../app/src/main.js'),
  ],
  output: {
    path: path.join(__dirname, '/../dist/'),
    filename: '[name].bundle.js',
    publicPath: '/',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '/../app/index.ejs'),
      inject: 'body',
      filename: 'index.ejs',
    }),
    new webpack.DefinePlugin({
      APP_CONFIG: {
        PUSHER_APP_KEY: `'${process.env.PUSHER_APP_KEY}'`,
        PUSHER_CHANNEL: `'${process.env.PUSHER_CHANNEL}'`,
        PUSHER_EVENT: `'${process.env.PUSHER_EVENT}'`,
      },
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
  module: {
    rules: [{
      exclude: [/node_modules/],
      test: /\.jsx$/,
      use: [{
        loader: 'babel-loader',
        options: {
          presets: ['latest'],
        },
      }],
    }, {
      test: /\.scss/,
      use: [
        'style-loader', {
          loader: 'css-loader',
          options: {
            sourceMap: true,
          },
        }, {
          loader: 'sass-loader',
          options: {
            sourceMap: true,
            includePaths: [path.join(__dirname, '/../app/src/styles/')],
          },
        },
      ],
    }],
  },
};

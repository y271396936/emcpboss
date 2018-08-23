'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
})

module.exports = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: '#cheap-module-eval-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.dev.env
    }),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
    new HtmlWebpackPlugin({
      filename: 'finance.html',
      template: 'finance.html',
      inject: true
    }),
    new HtmlWebpackPlugin({
      filename: 'increment.html',
      template: 'increment.html',
      inject: true
    }),
    new HtmlWebpackPlugin({
      filename: 'intermediary.html',
      template: 'intermediary.html',
      inject: true
    }),
    new HtmlWebpackPlugin({
      filename: 'majorization.html',
      template: 'majorization.html',
      inject: true
    }),
    new HtmlWebpackPlugin({
      filename: 'management.html',
      template: 'management.html',
      inject: true
    }),
    new HtmlWebpackPlugin({
      filename: 'operation.html',
      template: 'operation.html',
      inject: true
    }),
    new HtmlWebpackPlugin({
      filename: 'sale.html',
      template: 'sale.html',
      inject: true
    }),
    new HtmlWebpackPlugin({
      filename: 'service.html',
      template: 'service.html',
      inject: true
    }),
    new HtmlWebpackPlugin({
      filename: 'brand.html',
      template: 'brand.html',
      inject: true
    }),
    new FriendlyErrorsPlugin()
  ]
})

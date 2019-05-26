const path = require('path')
const webpack = require('webpack')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')

const mode = process.env.NODE_ENV || 'development'

module.exports = {
  devServer: {
    historyApiFallback: true,
    port: 8080
  },
  devtool: mode === 'production' ? 'source-map' : 'inline-source-map',
  entry: { app: ['normalize.css/normalize.css', './src/main.js', './src/styles/index.css'] },
  mode,
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          {
            loader: 'css-loader',
            options: { importLoaders: 1 }
          },
          'postcss-loader'
        ]
      },
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      { test: /\.svg$/, use: 'svg-sprite-loader' },
      { test: /\.vue$/, use: 'vue-loader' }
    ]
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development'
    }),
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/index.html')
    }),
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessorPluginOptions: {
        preset: ['default', { discardComments: { removeAll: true } }]
      }
    })
  ],
  resolve: {
    extensions: ['.js', '.vue']
  }
}

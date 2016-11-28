const path = require('path');
const webpack = require('webpack');

// Plugins being used in the webpack build process.
const CleanPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = {
  devtool: process.env.NODE_ENV === 'production' ? '#source-map' : '#eval-source-map',
  entry: ['./src/main.js', './src/styles/index.css'],
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/',
    filename: 'js/app.js'
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel', exclude: /node_modules/ },
      { test: /\.vue$/, loader: 'vue' },
      { test: /\.css$/, loaders: ['style-loader', 'css-loader?importLoaders=1', 'postcss-loader'] },
      { test: /\.(png|jpe?g|gif|svg)(\?.*)?$/, loader: 'url',
        query: {
          limit: 10000,
          name: 'img/[name].[ext]'
        }
      }
    ]
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new ExtractTextPlugin('css/app.css')
  ],
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue',
      'src': path.resolve(__dirname, './src'),
      'assets': path.resolve(__dirname, './src/assets'),
      'components': path.resolve(__dirname, './src/components')
    },
    extensions: ['', '.js', '.vue']
  },
  vue: {
    loaders: {
      js: 'babel',
      css: ExtractTextPlugin.extract(['css'])
    },
    postcss: [
      require('autoprefixer')({
        browsers: ['last 2 versions']
      })
    ]
  }
};

if (process.env.NODE_ENV === 'production') {
  config.plugins = config.plugins.concat([
    new CleanPlugin(['dist'], { exclude: ['index.html'] }),
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.css$/,
      cssProcessorOptions: { discardComments: { removeAll: true } }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ]);
}

module.exports = config;

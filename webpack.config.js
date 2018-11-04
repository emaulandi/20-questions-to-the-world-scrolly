const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {

	mode: 'development',

	entry: [
		'./src/globalSteps.js',
		'./src/countriesSteps.js',
		'./src/mapsUtils.js',
		'./src/forceUtils.js',
		'./src/constants.js',
		'./src/people-steps.js'
	],

	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'bundle.js'
	},

	plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html'
    }),
		new ExtractTextPlugin('style.css')
  ],

	module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
			{
				test: /\.html$/,
				loader: 'html-loader',
				options: {
				    attrs: ['image:xlink:href']
				}
			},
			{
	      test: /\.scss$/,
	      use: ['css-hot-loader'].concat(ExtractTextPlugin.extract({
	        fallback: 'style-loader',
	        use: ['css-loader', 'sass-loader']
	      }))
	    },
			{
        test: /\.(png|jp(e*)g|svg)$/,
        use: [{
            loader: 'url-loader',
            options: {
                limit: 8000, // Convert images < 8kb to base64 strings
                name: 'img/[hash]-[name].[ext]'
            }
        }]
			},
			{
				test: /\.json|geojson$/,
				loader: 'json-loader'
			},
			{
        test: /\.csv$/,
        loader: 'csv-loader',
        options: {
          dynamicTyping: true,
          header: true,
          skipEmptyLines: true
        }
      }
    ]
  },

	resolve: {
		modules: [path.resolve(__dirname, './src'), './node_modules'],
		alias: {
			'~': path.resolve(__dirname, './src')
		}
	},
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  }
}

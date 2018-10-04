const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {

	mode: 'development',

	entry: './src/test.js',

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
				loader: "raw-loader"
			},
			{
	      test: /\.scss$/,
	      use: ExtractTextPlugin.extract({
	        fallback: 'style-loader',
	        use: ['css-loader', 'sass-loader']
	      })
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

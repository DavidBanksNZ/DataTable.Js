const path = require('path');

module.exports = {
	entry: './src/index.js',

	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'bundle.js',
		libraryTarget: 'umd'
	},

	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader'
				}
			}
		]
	},

	resolve: {
		modules: [
			path.resolve(__dirname, 'src')
		],

		extensions: ['.js']
	},

	target: 'web'
};
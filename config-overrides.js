const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');
module.exports = function override(config) {
		const fallback = config.resolve.fallback || {};
		Object.assign(fallback, {
    	"crypto": require.resolve("crypto-browserify"),
      "stream": require.resolve("stream-browserify"),
			"querystring": require.resolve("querystring-es3"),
			"path": require.resolve("path-browserify"),
			"zlib": require.resolve("browserify-zlib"),
			"http": require.resolve("stream-http"),
			"https": require.resolve("https-browserify"),
			"url": require.resolve("url/")
      })
   config.resolve.fallback = fallback;
   config.plugins = (config.plugins || []).concat([
   	new webpack.ProvidePlugin({
    	process: 'process/browser',
      Buffer: ['buffer', 'Buffer']
    }),
		new Dotenv({
      systemvars: true
    })
   ])
   return config; }

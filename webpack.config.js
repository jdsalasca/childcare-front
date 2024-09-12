const path = require('path');
const webpack = require('webpack');

module.exports = {
  // Other Webpack config options...
  resolve: {
    fallback: {
      "http": require.resolve("stream-http"),
      "https": require.resolve("https-browserify"),
      "os": require.resolve("os-browserify/browser"),
    }
  },
  // Ensure you add this rule for polyfills if using Webpack 5.
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
  ],
};

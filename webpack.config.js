const path = require('path');

module.exports = {
  entry: {
    index: {
      import: path.resolve(__dirname, 'frontend', 'src', 'index.jsx'),
      filename: 'index.bundle.js',
    },
  },
  module: {
    rules: [
      {
        test: /\.js|jsx$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
    ]
  },
  target: 'web',
  mode: 'development',
  output: {
    path: path.resolve(__dirname, 'frontend', 'public'),
  },
};
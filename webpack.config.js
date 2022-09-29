const path = require('path');

module.exports = {
  entry: {
    main: {
      import: path.resolve(__dirname, 'frontend', 'src', 'main.jsx'),
      filename: 'main.bundle.js',
    },
    demo: {
      import: path.resolve(__dirname, 'frontend', 'src', 'demo.jsx'),
      filename: 'demo.bundle.js',
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
    ]
  },
  target: 'web',
  mode: 'development',
  output: {
    path: path.resolve(__dirname, 'frontend', 'public'),
  },
};
const path = require('path');

module.exports = {
    mode: 'development',
    entry: ['./js/design.js', './js/ff-perf.js'],
    module: {
        rules: [
          { test: /\.css$/, use: ['style-loader', 'css-loader'] },
        ],
      },
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'dest/')
    }
};
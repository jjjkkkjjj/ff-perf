const path = require('path');
var webpack = require("webpack");

var config = {
    // TODO: Add common Configuration
    module: {},
};

var bundleConfig = Object.assign({}, config,{
    mode: 'development',
    devtool: "inline-source-map",
    entry: ['./js/design.js', './js/ff-perf.js'],
    module: {
        rules: [
          { 
              test: /\.css$/,
            use: ['style-loader', 'css-loader']
         },
          {
            test: /\.js$/,
            enforce: 'pre',
            use: ['source-map-loader'],
          },
        ],
      },
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        })
    ],
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'dest/')
    }
});

var dataConfig = Object.assign({}, config,{
    mode: 'development',
    devtool: "inline-source-map",
    entry: ['./js/data.js'],
    module: {
        rules: [
          { 
              test: /\.css$/,
            use: ['style-loader', 'css-loader']
         },
          {
            test: /\.js$/,
            enforce: 'pre',
            use: ['source-map-loader'],
          },
        ],
      },
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        })
    ],
    output: {
        filename: 'data.js',
        path: path.join(__dirname, 'dest/')
    }
});

module.exports = [
    bundleConfig, dataConfig
];
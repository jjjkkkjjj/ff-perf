const path = require('path');
var webpack = require("webpack");


var config = {
    // TODO: Add common Configuration
    module: {}
};

var bundleConfig = Object.assign({}, config,{
    mode: 'development',
    // for debug
    devtool: "inline-source-map",
    entry: ['./js/design.js', './js/ff-perf.js'],
    // to load css file and js
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
          {
            test: /\.(png|jpg|gif)$/i,
            use: [
              {
                loader: 'url-loader',
                options: {
                  limit: 8192
                }
              }
            ]
          }
        ],
      },
      // load jquery
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
    // for debug
    devtool: "inline-source-map",
    entry: ['./js/data.js'],
    // to load css file and js
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
          {
            test: /\.(png|jpg|gif)$/i,
            use: [
              {
                loader: 'url-loader',
                options: {
                  limit: 8192
                }
              }
            ]
          }
        ],
      },
    // load jquery
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
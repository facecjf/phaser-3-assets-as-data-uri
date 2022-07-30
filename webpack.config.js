'use strict';

const webpack = require('webpack');
const path = require('path');

module.exports = {

    entry: './src/index.js',

    output: {
        path: path.resolve(__dirname, 'build'),
        publicPath: '/build/',
        filename: 'game.js'
    },

    module: {
        rules: [
            {
                test: [ /\.vert$/, /\.frag$/ ],
                use: 'raw-loader'
            },
            {
                test: /\.(png|jpg|gif|mp3)$/,
                use: [
                    { 
                        loader: 'img-optimize-loader',
                        options: {
                            compress: {
                            // This will take more time and get smaller images.
                            mode: 'high', // 'lossless', 'low'
                            disableOnDevelopment: true
                            }
                        }
                     }
                    ]
            }
        ]
    },

    plugins: [
        new webpack.DefinePlugin({
            'CANVAS_RENDERER': JSON.stringify(true),
            'WEBGL_RENDERER': JSON.stringify(true)
        })
    ]

};

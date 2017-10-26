"use strict";
const webpack = require("webpack");

module.exports = {
    entry: {
        app: './src/app'
    },
    output: {
        path: __dirname,
        filename: "[name].js"
    },

    watch: true,

    resolve: {
        modules: [
            'src',
            'node_modules'
        ],
        extensions: ['', '.json', '.js', '.jsx', '.ts', '.tsx']
    },

    module: {
        loaders: [{
            test: /\.(js)$/,
            exclude: /node_modules/,
            loader: "babel-loader"
        }, {
            test: /\.(ts)$/,
            exclude: /node_modules/,
            loader: "babel-loader!ts-loader"
        }, {
            test: /\.pug$/,
            loader: "pug-loader",
            query: {
                pretty: true
            }
        }]
    },
    devServer: {
        contentBase: __dirname,
        host: 'localhost',
        port: 3003
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery/dist/jquery.js",
            jQuery: "jquery/dist/jquery.js"
        })
    ]
};
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const client = {
    mode: 'development',
    target: 'web',
    entry: ['babel-polyfill', './src/index.js'],
    output: {
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: 'babel-loader'
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader'
                })
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin('styles.css'),
    ]
};

const server = {
    mode: 'development',
    target: 'node',
    entry: ['babel-polyfill', './src/server.js'],
    output: {
        filename: 'server.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: 'babel-loader'
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader'
                })
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin('styles.css'),
    ]
};

module.exports = [client, server];
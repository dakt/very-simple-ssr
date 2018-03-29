const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');


const client = {
    mode: 'development',
    target: 'web',
    devtool: 'source-map',
    entry: {
        bundle: ['babel-polyfill', './src/client/index.js'],
        serviceWorker: './src/client/serviceWorker.js',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
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
                    use: 'css-loader?modules&localIdentName=[hash:base64:5]_[local]'
                }),
            },
        ],
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
        },
    },
    plugins: [
        new ExtractTextPlugin('styles.css'),
    ],
};

const server = {
    mode: 'development',
    target: 'node',
    entry: ['./src/server/server.js'],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'server.js',
        libraryTarget: 'commonjs2',
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
                    use: 'css-loader?modules&localIdentName=[hash:base64:5]_[local]'
                }),
            },
        ],
    },
    plugins: [
        new ExtractTextPlugin('styles.css'),
    ],
};

module.exports = [client, server];

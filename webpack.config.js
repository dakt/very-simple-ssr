const path = require('path');
const process = require('process');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');


const isProduction = process.env.NODE_ENV === 'production';

const sharedPlugins = [new ExtractTextPlugin('styles.css')];
const clientPlugins = sharedPlugins.concat(isProduction ? [
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    new UglifyJsPlugin({
        parallel: true,
    }),
    new BundleAnalyzerPlugin(),
] : []);
const serverPlugins = sharedPlugins;

const modulesRules = [
    {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
    },
    {
        test: /\.css$/,
        exclude: /node_modules/,
        use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: 'css-loader?modules&localIdentName=[name]-[local]_[hash:base64:3]',
        }),
    },
];

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
        rules: modulesRules,
    },
    // Webpack 4 doesn't use commonChunksPlugin anymore:
    // https://gist.github.com/sokra/1522d586b8e5c0f5072d7565c2bee693
    optimization: {
        splitChunks: {
            cacheGroups: {
                lib: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'lib',
                    chunks: 'all',
                    filename: '[name]-bundle.js',
                },
            },
        },
    },
    plugins: clientPlugins,
};

const server = {
    mode: 'development',
    target: 'node',
    entry: ['./src/server/index.js'],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'server.js',
        libraryTarget: 'commonjs2',
    },
    module: {
        rules: modulesRules,
    },
    plugins: serverPlugins,
};

module.exports = [client, server];

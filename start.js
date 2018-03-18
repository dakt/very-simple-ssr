const webpack = require('webpack');
const MemoryFS = require('memory-fs');
const path = require('path');
const Module = require('module');
require('babel-polyfill');


const config = require('./webpack.config');
const [ clientConfig, serverConfig ] = config;
const clientCompiler = webpack(clientConfig);
const serverCompiler = webpack(serverConfig);
const fs = new MemoryFS();
let server = null;

clientCompiler.watch({

}, (err, stats) => {

    console.log('Watching client files');
});

serverCompiler.outputFileSystem = fs;
serverCompiler.watch({

}, (err, stats) => {

    const content = fs.readFileSync(
        path.resolve(
            serverConfig.output.path,
            serverConfig.output.filename
        ),
        'utf8'
    );

    const serverModule = new Module();
    serverModule._compile(content, serverConfig.output.filename);

    const app = serverModule.exports.default;

    if (server && server.listening) {
        server.close();
    }

    server = app.listen(3000, () => {
        console.log('Server started');
    });

    console.log('Watching server files');
});
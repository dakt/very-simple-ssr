require('babel-polyfill');
const webpack = require('webpack');
const MemoryFS = require('memory-fs');
const path = require('path');
const Module = require('module');
const os = require('os');
const config = require('./webpack.config');

const [clientConfig, serverConfig] = config;
const clientCompiler = webpack(clientConfig);
const serverCompiler = webpack(serverConfig);
const fs = new MemoryFS();
let server = null;

function printErrors(stats) {
    const statsJson = stats.toJson();

    statsJson.errors.forEach(error => {
        console.error(error.replace('\n', os.EOL));
    });
}

clientCompiler.watch({
    ignored: /node_modules/,
}, (err, stats) => {

    if (stats.hasErrors()) {
        printErrors(stats);
        console.log('COMPILATIONS ERRORS');
        return;
    }

    console.log('Watching client files');
});

serverCompiler.outputFileSystem = fs;

serverCompiler.watch({
    ignored: /node_modules/,
}, (err, stats) => {

    if (stats.hasErrors()) {
        printErrors(stats);
        console.log('COMPILATIONS ERRORS');
        return;
    }

    const content = fs.readFileSync(
        path.resolve(
            serverConfig.output.path,
            serverConfig.output.filename,
        ),
        'utf8',
    );

    const serverModule = new Module();
    serverModule._compile(content, serverConfig.output.filename);

    const app = serverModule.exports.default;

    if (server && server.listening) {
        server.close();
    }

    server = app.listen(3000, '0.0.0.0', () => {
        console.log('Server started');
    });

    console.log('Watching server files');
});
require('babel-polyfill');
const app = require('./dist/server.js').default;


app.listen(8080, '0.0.0.0', () => {
    console.log('Server started');
});
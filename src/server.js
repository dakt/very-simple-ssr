import express from 'express';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { matchPath, MemoryRouter as Router } from 'react-router';

import App from './shared/App';
import routes from './shared/routes';
import NotFound from './shared/404';


function renderToHTML(Element, initialProps) { 
    const html = ReactDOMServer.renderToString(Element);

    return `<!DOCTYPE html>
<html>
    <head>
        <title>SSR</title>
        <script defer type="text/javascript" src="bundle.js"></script>
        <link rel="stylesheet" href="styles.css">
    </head>
    <body>
        <div id="root">${html}</div>
        <script type="text/javascript">
            window.__INITIAL_PROPS__ = JSON.parse('${JSON.stringify(initialProps)}');
        </script>
    </body>
</html>
`;
}

const app = express();

app.use(express.static('dist'));

app.get('/*', async (req, res) => {
    console.log(req.method, req.url);

    let match = routes.reduce((acc, route) => {
        const found = matchPath(req.url, route);

        return found ? route : acc;
    }, null);

    match === null && (match = { component: NotFound });

    const Component = (
        <Router>
            <App>
                {<match.component />}
            </App>
        </Router>
    );

    const intialState = {};

    res.send(renderToHTML(Component, intialState));
});

export default app;
import express from 'express';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { matchPath, MemoryRouter as Router } from 'react-router';
import { Provider } from 'react-redux';
import { createMemoryHistory } from 'history';

import App from '../shared/App';
import routes from '../shared/routes';
import NotFound from '../shared/404';
import { configureStore } from '../shared/store';


const router = express.Router();

function renderToHTML(Element, initialProps) {
    const html = ReactDOMServer.renderToString(Element);

    return `<!DOCTYPE html>
<html>
    <head>
        <title>SSR</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        
        <link rel="shortcut icon" href="data:image/x-icon;," type="image/x-icon">
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css?family=Roboto:300,400" rel="stylesheet">
        <link rel="stylesheet" href="/styles.css">

        <script defer type="text/javascript" src="/lib-bundle.js"></script>
        <script defer type="text/javascript" src="/bundle.js"></script>
    </head>
    <body>
        <div id="root">${html}</div>
        <script type="text/javascript">
            window.__INITIAL_STATE__ = ${JSON.stringify(initialProps).replace(/</g, '\\u003c')};
        </script>
    </body>
</html>
`;
}

router.get('/*', async (req, res) => {
    try {
        const history = createMemoryHistory({ initialEntries: [req.url] });
        const store = configureStore(history, routes);

        let match = routes.reduce((acc, route) => {
            const found = matchPath(req.path, route);
            return found ? { ...route, ...found } : acc;
        }, null);

        if (match === null) {
            match = { component: NotFound };
        }

        if (match.component.getInitialData) {
            await match.component.getInitialData({
                ...req,
                dispatch: store.dispatch,
                getState: store.getState,
                isServer: true,
            });
        }

        const Component = (
            <Provider store={store}>
                <Router>
                    <App>
                        {<match.component />}
                    </App>
                </Router>
            </Provider>
        );

        const intialState = store.getState();

        res.send(renderToHTML(Component, intialState));
    } catch (error) {
        console.error('Server Error:', error);
        res.status(500);
    }
});

export default router;
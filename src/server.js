import 'isomorphic-fetch';
import express from 'express';
import faker from 'faker';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { matchPath, MemoryRouter as Router } from 'react-router';
import { Provider } from 'react-redux';
import { createMemoryHistory } from 'history';

import App from './shared/App';
import routes from './shared/routes';
import NotFound from './shared/404';
import { configureStore } from './shared/store';


function generateFakeData() {
    const data = [];

    for (let i = 0; i <= 100; i += 1) {
        data.push({
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: faker.internet.email(),
            avatar: faker.image.avatar(),
        });
    }

    return data;
}

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
        <link rel="stylesheet" href="styles.css">

        <script defer type="text/javascript" src="vendors~bundle.js"></script>
        <script defer type="text/javascript" src="bundle.js"></script>
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

const app = express();
const FAKE_DATA = generateFakeData();

app.use(express.static('dist'));

app.get('/api/users', async (req, res) => {
    res.send({ data: FAKE_DATA });
});

app.get('/*', async (req, res) => {
    console.log(req.method, req.path);

    const history = createMemoryHistory({ initialEntries: [req.url] });
    const store = configureStore(history);

    let match = routes.reduce((acc, route) => {
        const found = matchPath(req.path, route);
        return found ? route : acc;
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
});


export default app;

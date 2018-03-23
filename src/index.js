import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createBrowserHistory } from 'history';
import { Route, Switch, Link, Router } from 'react-router-dom';

import App from './shared/App';
import routes from './shared/routes';
import { configureStore } from './shared/redux';


const history = createBrowserHistory();
const store = configureStore(history);

ReactDOM.hydrate(
    <Provider store={store}>
        <Router history={history}>
            <App>
                <Switch>
                {routes.map(route => (
                    <Route
                        key={route.path}
                        path={route.path}
                        exact={route.exact}
                        component={route.component} 
                    />
                ))}
                </Switch>
            </App>
        </Router>
    </Provider>,
    document.getElementById('root')
);
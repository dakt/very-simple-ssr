import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createBrowserHistory } from 'history';
import { Route, Switch, Router } from 'react-router-dom';

import App from '../shared/App';
import routes from '../shared/routes';
import { configureStore } from '../shared/store';
import * as SwManager from './swManager';


const history = createBrowserHistory();
const store = configureStore(history, routes);
//SwManager.register('serviceWorker.js');

ReactDOM.hydrate(
    <Provider store={store}>
        <Router history={history}>
            <App>
                <Switch>
                    {routes.map((route) => {
                        const render = (props) => {
                            const Component = route.component;

                            if (Component.getInitialData) {
                                Component.getInitialData({
                                    dispatch: store.dispatch,
                                    getState: store.getState,
                                    isServer: false,
                                });
                            }

                            return <Component {...props} />;
                        };

                        return (
                            <Route
                                key={route.path}
                                path={route.path}
                                exact={route.exact}
                                render={render}
                            />
                        );
                    })}
                </Switch>
            </App>
        </Router>
    </Provider>,
    document.getElementById('root'),
);

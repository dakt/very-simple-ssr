import React from 'react';
import ReactDOM from 'react-dom';
import { 
    BrowserRouter as Router, 
    Route, Switch, Link 
} from 'react-router-dom';
import { Provider } from 'react-redux';

import App from './shared/App';
import routes from './shared/routes';
import { configureStore } from './shared/redux';

const store = configureStore();

ReactDOM.hydrate(
    <Provider store={store}>
        <Router>
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
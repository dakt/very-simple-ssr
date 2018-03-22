import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';

import App from './shared/App';
import routes from './shared/routes';


ReactDOM.hydrate(
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
    </Router>,
    document.getElementById('root')
);
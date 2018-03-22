import React from 'react';
import { Link } from 'react-router-dom';

import './app.css';


export default ({ children }) => (
    <div className="app">
        <div>
            <div className="appNavigationBar">
                <Link to="/">Home</Link>
                <Link to="/about">About</Link>
                <Link to="/user">User</Link>
            </div>
            <div className="appBody">
                { children }
            </div>
        </div>
    </div>
);

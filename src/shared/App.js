import React from 'react';
import { Link } from 'react-router-dom';


export default ({ children }) => (
    <div>
        <div>
            <div>
                <Link to="/">Home</Link>
                <Link to="/about">About</Link>
                <Link to="/user">User</Link>
            </div>
            <div>
                { children }
            </div>
        </div>
    </div>
);

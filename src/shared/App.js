import React from 'react';
import { Link } from 'react-router-dom';

import styles from './app.css';
import './global.css';


export default ({ children }) => (
    <div className={styles.app}>
        <div>
            <div className={styles.navigationBar}>
                <Link to="/">Home</Link>
                <Link to="/about">About</Link>
            </div>
            <div className={styles.body}>
                { children }
            </div>
        </div>
    </div>
);

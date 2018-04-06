import React from 'react';
import { Link, withRouter } from 'react-router-dom';

import styles from './app.css';
import './global.css';


export default withRouter(({ children, location }) => (
    <div className={styles.app}>
        <div>
            <div className={styles.navigationBar}>
                <Link to="/">
                    { location.pathname === '/' 
                        ? (<i className="material-icons">menu</i>)
                        : (<i className="material-icons">keyboard_arrow_left</i>)
                    }
                </Link>
            </div>
            <div className={styles.body}>
                { children }
            </div>
        </div>
    </div>
));

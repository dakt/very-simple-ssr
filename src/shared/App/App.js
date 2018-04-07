import React from 'react';
import { Link, withRouter } from 'react-router-dom';


import Icon from '../components/Icon';
import ActionBar from './ActionBar';
import styles from './App.css';
import '../global.css';


export default withRouter(({ children, location }) => (
    <div className={styles.app}>
        <div>
            <div className={styles.navigationBar}>
                <Link to="/">
                    { location.pathname === '/' 
                        ? (<Icon name="menu" />)
                        : (<Icon name="keyboard_arrow_left" />)
                    }
                </Link>

                <div className={styles.navRight}>
                    <ActionBar />
                </div>
            </div>
            <div className={styles.body}>
                { children }
            </div>
        </div>
    </div>
));
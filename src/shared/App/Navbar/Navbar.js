import React from 'react';

import styles from './Navbar.css';

import Burger from './Burger';
import ActionBar from './ActionBar';


export default ({ location }) => (
    <div className={styles.navigationBar}>
        <div className={styles.navLeft}>
            <Burger location={location} />
        </div>

        <div className={styles.navRight}>
            <ActionBar />
        </div>
    </div>
);
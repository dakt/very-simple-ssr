import React from 'react';
import { withRouter } from 'react-router-dom';


import Navbar from './Navbar';
import styles from './App.css';
import '../global.css';


export default withRouter(({ children, location }) => (
    <div className={styles.app}>
        <div>
            <Navbar location={location} />
            <div className={styles.body}>
                { children }
            </div>
        </div>
    </div>
));

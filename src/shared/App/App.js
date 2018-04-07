import React from 'react';
import { withRouter } from 'react-router-dom';


import Icon from '../components/Icon';
import ActionBar from './ActionBar';
import Burger  from './Burger';
import styles from './App.css';
import '../global.css';


export default withRouter(({ children, location }) => (
    <div className={styles.app}>
        <div>
            <div className={styles.navigationBar}>
                <div className={styles.navLeft}>
                    <Burger location={location} />
                </div>

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

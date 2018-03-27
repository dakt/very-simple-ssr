import React from 'react';

import styles from './UserCard.css';



export default class UserCard extends React.Component {
    render() {
        return (
            <div className={styles.container} {...this.props}>
                <div>{this.props.data.name}</div>
                <div>{this.props.data.username}</div>
                <div>{this.props.data.email}</div>
            </div>
        );
    }
};

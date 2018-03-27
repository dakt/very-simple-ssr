import React from 'react';

import Check from './Check';
import styles from './UserCard.css';



export default class UserCard extends React.Component {
    render() {
        return (
            <div className={styles.container}>
                <div className={styles.iconContainer}>
                    <Check
                        checked={this.props.checked}
                        onClick={(e) => this.props.onChecked(e, this.props.data)}
                    />
                </div>
                <div className={styles.body}>
                    <div>{this.props.data.name}</div>
                    <div>{this.props.data.username}</div>
                    <div>{this.props.data.email}</div>
                </div>
            </div>
        );
    }
};

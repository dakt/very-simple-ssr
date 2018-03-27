import React from 'react';

import './UserCard.css';


export default class UserCard extends React.Component {
    render() {
        return (
            <div className="userCard" {...this.props}>
                <div className="userName">{this.props.data.name}</div>
                <div className="userName">{this.props.data.username}</div>
                <div className="userEmail">{this.props.data.email}</div>
            </div>
        );
    }
};

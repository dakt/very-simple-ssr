import React from 'react';
import { connect } from 'react-redux';

import { Actions, Selectors } from './redux';
import styles from './User.css';


class User extends React.Component {

    static getInitialData({ isServer, dispatch, getState }) {
        const state = getState();
        const { id } = state.route.params;
        return dispatch(Actions.getUser(id));
    }

    render() {
        const { data } = this.props;

        return (
            <div className={styles.container}>
                <img src={data.avatar} alt={data.avatar} />
                <span>{data.firstName}</span>
                <span>{data.lastName}</span>
                <span>{data.email}</span>
                <span>{data.country}</span>
                <span>{data.city}</span>
                <p>{data.aboutMe}</p>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    data: Selectors.getUser(state),
});

const mapDispatchToProps = dispatch => ({
    getUser: id => dispatch(Actions.getUser(id)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(User);

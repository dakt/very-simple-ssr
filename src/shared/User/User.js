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
                <div className={styles.avatar}>
                    <img src={data.avatar} alt={data.avatar} />
                </div>
                <div className={styles.infoBox}>
                    <div className={styles.name}>{data.firstName} {data.lastName}</div>
                    <div className={styles.textRow}>{data.email}</div>
                    <div className={styles.textRow}>{data.city}, {data.country}</div>
                    <div className={styles.aboutMe}>
                        <div>About Me</div>
                        <p>{data.aboutMe}</p>
                    </div>
                </div>
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

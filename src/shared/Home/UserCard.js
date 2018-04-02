import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import cx from 'classnames';

import { Selectors } from './redux';
import Check from '../components/Check';
import styles from './UserCard.css';


const UserCard = ({ onChecked, data, checked }) => (
    <div className={cx(styles.container, { [styles.checked]: checked })}>
        <div className={styles.iconContainer}>
            {/* <Check
                checked={checked}
                onClick={e => onChecked(e, data)}
            /> */}
            <div className={styles.avatar}>
                <img src={data.avatar} alt="avatar" />
            </div>
        </div>
        <div className={styles.body}>
            <div>{data.firstName}</div>
            <div>{data.lastName}</div>
            <div>{data.email}</div>
        </div>
    </div>
);

UserCard.defaultProps = {
    data: {},
    checked: false,
    onChecked: f => f,
};

UserCard.propTypes = {
    data: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.any,
    ]),
    checked: PropTypes.bool,
    onChecked: PropTypes.func,
};

const mapStateToProps = (state, ownProps) => ({
    checked: Selectors.isChecked(state, ownProps.data.id),
});

export default connect(mapStateToProps)(UserCard);

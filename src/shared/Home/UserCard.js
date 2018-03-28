import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Check from '../components/Check';
import styles from './UserCard.css';


const UserCard = ({ onChecked, data, checked }) => (
    <div className={cx(styles.container, { [styles.checked]: checked })}>
        <div className={styles.iconContainer}>
            <Check
                checked={checked}
                onClick={e => onChecked(e, data)}
            />
        </div>
        <div className={styles.body}>
            <div>{data.name}</div>
            <div>{data.username}</div>
            <div>{data.email}</div>
        </div>
    </div>
);

UserCard.defaultProps = {
    onChecked: f => f,
    data: {},
    checked: false,
};

UserCard.propTypes = {
    onChecked: PropTypes.func,
    checked: PropTypes.bool,
};

export default UserCard;

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import cx from 'classnames';

import Check from '../components/Check';
import Icon from '../components/Icon';
import styles from './UserCard.css';


const UserCard = ({ onChecked, onAvatarClicked, data, checkboxVisible, checked }) => (
    <Link
        to={`/user/${data.id}`}
        className={cx(styles.container, { [styles.checked]: checked })}
        draggable="false"
    >
        <div className={styles.iconContainer}>
            { checkboxVisible ? (
                    <Check
                        checked={checked}
                        onClick={e => { e.preventDefault(); onChecked(e, data); }}
                    />
                ) : (
                    <div className={styles.avatar} onClick={(e) => { e.preventDefault(); onAvatarClicked(); }}>
                        <img src={data.avatar} alt="avatar" />
                    </div>
                )
            }
        </div>
        <div className={styles.body}>
            <div className={styles.name}>{data.firstName} {data.lastName}</div>
            <div className={styles.email}>
                <Icon name="mail_outline" />
                <span>{data.email}</span>
            </div>
        </div>
    </Link>
);

UserCard.defaultProps = {
    data: {},
    checked: false,
    onChecked: f => f,
    onClick: f => f,
};

UserCard.propTypes = {
    data: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.any,
    ]),
    checked: PropTypes.bool,
    onChecked: PropTypes.func,
    onClick: PropTypes.func,
};

export default UserCard;

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import cx from 'classnames';

import { Selectors } from './redux';
import Check from '../components/Check';
import styles from './UserCard.css';


const UserCard = ({ onChecked, onClick, data, checked }) => (
    <Link to={`/user/${data.id}`} className={cx(styles.container, { [styles.checked]: checked })} draggable="false">
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
            <div className={styles.name}>{data.firstName} {data.lastName}</div>
            <div className={styles.email}>
                <i className="material-icons">mail_outline</i>
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

const mapStateToProps = (state, ownProps) => ({
    checked: Selectors.isChecked(state, ownProps.data.id),
});

export default connect(mapStateToProps)(UserCard);

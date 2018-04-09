import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import cx from 'classnames';

import { Actions as ListActions, Selectors as ListSelectors } from './redux';
import { Actions as NavbarActions, Selectors as NavbarSelectors } from '../App/Navbar/redux';
import Check from '../components/Check';
import Icon from '../components/Icon';
import styles from './UserCard.css';


class UserCard extends React.Component {

    handleAvatarClick(event, data) {
        event.preventDefault();
        event.stopPropagation();
        this.props.onAvatarClick(); 
        this.props.onCheckClick(data);
    }

    handleCheckboxClick(event, data) {
        event.preventDefault();
        event.stopPropagation();
        this.props.onCheckClick(data);
    }

    handleClick(event, data) {
        if (this.props.showCheckbox) {
            event.preventDefault();
            this.props.onCheckClick(data);
        }
    }

    render() {
        const { data, isChecked, showCheckbox, } = this.props;

        return (
            <Link
                to={`/user/${data.id}`}
                onClick={event => this.handleClick(event, data)}
                className={cx(styles.container, { [styles.checked]: isChecked })}
                draggable="false"
            >
                <div className={styles.iconContainer}>
                    { showCheckbox ? (
                            <Check
                                checked={isChecked}
                                onClick={e => this.handleCheckboxClick(e, data)}
                            />
                        ) : (
                            <div className={styles.avatar} onClick={(e) => this.handleAvatarClick(e, data)}>
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
    }
}

UserCard.defaultProps = {
    data: {},
    isChecked: false,
    onCheckClick: f => f,
    onClick: f => f,
};

UserCard.propTypes = {
    data: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.any,
    ]),
    isChecked: PropTypes.bool,
    onClick: PropTypes.func,
    onCheckClick: PropTypes.func,
};

const mapStateToProps = (state, ownProps) => ({
    isChecked: ListSelectors.isChecked(state, ownProps.data.id),
    showCheckbox: NavbarSelectors.actionsVisible(state),
});

const mapDispatchToProps = dispatch => ({
    onAvatarClick: () => dispatch(NavbarActions.toggleActions()),
    onCheckClick: data => dispatch(ListActions.entityCheck(data.id)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UserCard);

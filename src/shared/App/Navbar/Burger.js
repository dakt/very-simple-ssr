import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { Actions, Selectors } from './redux';
import Icon from '../../components/Icon';


const Burger = ({ visible, location, onBackClick }) => (
    visible ? (
        <Icon name="keyboard_arrow_left" onClick={() => onBackClick()} />
    ) : (
        <Link to="/">
        { location.pathname === '/' 
            ? (<Icon name="menu" />)
            : (<Icon name="keyboard_arrow_left" />)
        }
        </Link>
    )
);

const mapStateToProps = state => ({
    visible: Selectors.actionsVisible(state),
});

const mapDispatchToProps = dispatch => ({
    onBackClick: () => dispatch(Actions.toggleActions()),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Burger);

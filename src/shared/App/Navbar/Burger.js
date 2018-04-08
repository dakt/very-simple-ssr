import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { Actions, Selectors } from './redux';
import Icon from '../../components/Icon';


const Burger = ({ visible, location, onBackClicked }) => (
    visible ? (
        <Icon name="keyboard_arrow_left" onClick={() => onBackClicked()} />
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
    visible: Selectors.avtionsVisible(state),
});

const mapDispatchToProps = dispatch => ({
    onBackClicked: () => dispatch(Actions.toggleActions()),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Burger);
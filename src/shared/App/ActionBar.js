import React from 'react';
import { connect } from 'react-redux';
import { CSSTransition } from 'react-transition-group';

import Icon from '../components/Icon';
import { Selectors } from './redux';

import './ActionBar.css';


const ActionBar = ({ visible }) => (
    <div>
        <CSSTransition
            in={visible}
            classNames="actionBar"
            timeout={{ enter: 200, exit: 200 }}
        >
            <Icon className="actionBar" name="delete" onClick={() => alert('!')} />
        </CSSTransition>
    </div>
);

const mapStateToProps = state => ({
    visible: Selectors.avtionsVisible(state),
});

export default connect(mapStateToProps)(ActionBar);
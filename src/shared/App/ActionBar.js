import React from 'react';
import { connect } from 'react-redux';
import { Selectors } from './redux';

import Icon from '../components/Icon';


const ActionBar = ({ visible }) => (
    <div>
        { visible && <Icon name="delete" onClick={() => alert('!')} /> }
    </div>
);

const mapStateToProps = state => ({
    visible: Selectors.avtionsVisible(state),
});

export default connect(mapStateToProps)(ActionBar);
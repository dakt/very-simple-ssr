import React from 'react';
import PropTypes from 'prop-types';


const Check = props => (
    <div {...props}>
        <i className="material-icons">
            {props.checked ? 'check_circle' : 'panorama_fish_eye'}
        </i>
    </div>
);

Check.defaultProps = {
    checked: false,
};

Check.propTypes = {
    checked: PropTypes.bool,
};

export default Check;

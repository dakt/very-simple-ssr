import React from 'react';
import cx from 'classnames';


export default (props) => (
    <i {...props} className={cx("material-icons", props.className)}>{props.name}</i>
);
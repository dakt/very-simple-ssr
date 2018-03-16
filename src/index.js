import React from 'react';
import ReactDOM from 'react-dom';
import Sample from './shared/sample';

ReactDOM.hydrate(
    <Sample {...window.__INITIAL_PROPS__} />,
    document.getElementById('root')
);
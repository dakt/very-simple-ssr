import React from 'react';


export default class Check extends React.Component {
    render() {
        return (
            <div {...this.props}>
                <i className="material-icons">
                    {this.props.checked ? "check_circle" : "panorama_fish_eye"}
                </i>
            </div>
        );
    }
}
import React from 'react';
import PropTypes from 'prop-types';
import './sample.css';


export default class extends React.Component {

    state = { renderClient: false }

    static propTypes = {
        message: PropTypes.string,
    }

    static async getInitialProps() {
        // Simulate async op. server side
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ message: 'Hello from Server' });
            });
        });
    }

    componentDidMount() {
        // Simulate async op. client side
        setTimeout(() => this.setState({ renderClient: true }));
    }

    render() {
        return (
            <div className="server">
                <h1>Server</h1>
                {this.props.message}
                {
                    this.state.renderClient && (
                        <div className="client">
                            <h1>Client</h1>
                            Hello from client
                        </div>
                    )
                }
            </div>
        );
    }
}
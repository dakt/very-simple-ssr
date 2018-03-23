import React from 'react';
import { connect } from 'react-redux';


export class GistList extends React.Component {

    static async getInitialData({ isServer, dispatch, getState }) {
        const state = getState();

        try {
            dispatch({ type: 'GET_GIST_REQUEST' });
            const payload = await fetch('https://jsonplaceholder.typicode.com/users?_page=1&_limit=5').then(response => response.json());
            dispatch({ type: 'GET_GIST_SUCCESS', payload });
        } catch (error) {
            dispatch({ type: 'GET_GIST_FAILURE', error });
        }
    }

    render() {
        return (
            <div>
                <h1>Home</h1>
                <table className="table">
                    <tbody>
                        {this.props.data.map(d => (
                            <tr key={d.id}>
                                <td>{d.name}</td>
                                <td>{d.email}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    loading: state.gist.loading,
    data: state.gist.data,
});

export default connect(mapStateToProps)(GistList);
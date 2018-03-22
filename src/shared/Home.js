import React from 'react';
import { connect } from 'react-redux';


class GistList extends React.Component {
    render() {
        return (
            <table className="table">
                <tbody>
                    {this.props.data.map(d => (
                        <tr key={d.id}>
                            <td><img src={d.owner.avatar_url} /></td>
                            <td>{d.owner.login}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    }
}


const mapStateToProps = (state) => ({
    loading: state.loading,
    data: state.data,
});

const ConnectedGistList = connect(mapStateToProps)(GistList);


export default class extends React.Component {

    static async getInitialData({ ctx, dispatch }) {
        try {
            dispatch({ type: 'GET_GIST_REQUEST' });
            const payload = await fetch('https://api.github.com/gists/public').then(response => response.json());
            dispatch({ type: 'GET_GIST_SUCCESS', payload });
        } catch (error) {
            dispatch({ type: 'GET_GIST_FAILURE', error });
        }
    }

    render() {
        return (
            <div>
                <h1>Home</h1>
                <ConnectedGistList />
            </div>
        );
    }
}
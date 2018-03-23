import React from 'react';
import { connect } from 'react-redux';


export class GistList extends React.Component {

    static async getInitialData({ dispatch }) {
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
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    loading: state.gist.loading,
    data: state.gist.data,
});

export default connect(mapStateToProps)(GistList);
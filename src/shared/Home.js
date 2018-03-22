import React from 'react';


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
            </div>
        );
    }
}
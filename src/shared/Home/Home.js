import React from 'react';
import { connect } from 'react-redux';

import List from './List';
import UserCard from './UserCard';
import styles from './Home.css';


export class GistList extends React.Component {

    static async getInitialData({ isServer, dispatch, getState }) {
        const {
            route: { qs },
            gist: { pagination },
        } = getState();

        const page  = qs.page ? qs.page : pagination.page;
        const limit = qs.limit ? qs.limit : pagination.limit;
        const url   = `https://jsonplaceholder.typicode.com/users?_page=${page}&_limit=${limit}`;

        try {
            dispatch({ type: 'GET_DATA_REQUEST' });

            const response = await fetch(url);
            const count = response.headers.get('x-total-count');
            const payload = { 
                data: await response.json(),
                pagination: { page, limit, count },
            };

            dispatch({ type: 'GET_DATA_SUCCESS', payload });
        } catch (error) {
            dispatch({ type: 'GET_DATA_FAILURE', error });
        }
    }

    handleClick() {

    }

    handleChecked(event, data) {
        this.props.toggleCheck(data.id);
    }

    render() {
        return (
            <div>
                <div className={styles.navigation}>
                </div>
                <List data={this.props.data} loading={this.props.loading}>
                    {
                        data => (
                            <UserCard
                                data={data}
                                onClick={() => this.handleClick()}
                                onChecked={(e, data) => this.handleChecked(e, data)}
                                checked={this.props.checked.includes(data.id)}
                            />
                        )
                    }
                </List>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    loading: state.gist.loading,
    data: state.gist.data,
    checked: state.gist.checked,
    pagination: state.gist.pagination,
});

const mapDispatchToProps = (dispatch) => ({
    toggleCheck: (id) => dispatch({ type: "GIST_CHECK", payload: { id } }),
})

export default connect(mapStateToProps, mapDispatchToProps)(GistList);
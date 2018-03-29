import React from 'react';
import { connect } from 'react-redux';

import List from '../components/List';
import UserCard from './UserCard';
import { Actions } from './redux';
import ApiCall from '../utils/rest';
import styles from './Home.css';


export class GistList extends React.Component {

    static async getInitialData({ isServer, dispatch, getState }) {
        const {
            route: { qs },
            entities: { pagination },
        } = getState();

        const page = qs.page ? qs.page : pagination.page;
        const limit = qs.limit ? qs.limit : pagination.limit;

        try {
            dispatch(Actions.getEntitiesRequest());

            const response = await ApiCall(`/users?page=${page}&limit=${limit}`).get();
            const { data, count } = response;
            const payload = {
                data,
                pagination: { page, limit, count },
            };

            dispatch(Actions.getEntitiesSuccess(payload));
        } catch (error) {
            dispatch(Actions.getEntitiesFailure(error));
        }
    }

    handleClick() {
        console.log('View item');
    }

    handleChecked(event, data) {
        this.props.toggleCheck(data.id);
    }

    handleRemoveItem(data) {
        this.props.remove(data.id);
    }

    render() {
        return (
            <div>
                <div className={styles.navigation} />
                <List
                    data={this.props.data}
                    loading={this.props.loading}
                    onRemove={data => this.handleRemoveItem(data)}
                    onNearEnd={_ => this.props.loadMore()}
                >
                    {
                        data => (
                            <UserCard
                                data={data}
                                onClick={() => this.handleClick()}
                                onChecked={(e, d) => this.handleChecked(e, d)}
                                checked={this.props.checked.includes(data.id)}
                            />
                        )
                    }
                </List>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    loading: state.entities.loading,
    data: state.entities.data,
    checked: state.entities.checked,
    pagination: state.entities.pagination,
});

const mapDispatchToProps = dispatch => ({
    toggleCheck: id => dispatch({ type: 'ENTITY_CHECK', payload: { id } }),
    remove: id => dispatch(Actions.deleteEntity(id)),
    loadMore: () => dispatch(Actions.loadMore()),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(GistList);

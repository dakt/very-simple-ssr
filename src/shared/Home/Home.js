import React from 'react';
import { connect } from 'react-redux';

import List from '../components/List';
import UserCard from './UserCard';
import { Actions } from './redux';
import ApiCall from '../utils/rest';
import styles from './Home.css';


export class GistList extends React.Component {

    static getInitialData({ isServer, dispatch, getState }) {
        return dispatch(Actions.loadMore());
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
    toggleCheck: id => dispatch(Actions.entityCheck(id)),
    remove: id => dispatch(Actions.deleteEntity(id)),
    loadMore: () => dispatch(Actions.loadMore()),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(GistList);

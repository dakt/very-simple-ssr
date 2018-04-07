import React from 'react';
import { connect } from 'react-redux';

import List from '../components/List';
import UserCard from './UserCard';
import { Actions, Selectors } from './redux';
import { Actions as AppActions, Selectors as AppSelectors } from '../App/redux';
import styles from './Home.css';


export class GistList extends React.Component {

    static getInitialData({ isServer, dispatch, getState }) {
        return dispatch(Actions.loadMore());
    }

    handleChecked(event, data) {
        this.props.toggleCheck(data.id);
    }

    handleRemoveItem(data) {
        this.props.remove(data.id);
    }

    connectAndRenderUserCard(data) {
        const mapStateToProps = (state, ownProps) => ({
            checked: Selectors.isChecked(state, ownProps.data.id),
            checkboxVisible: AppSelectors.avtionsVisible(state),
        });

        const mapDispatchToProps = dispatch => ({
            onAvatarClicked: () => dispatch(AppActions.toggleActions()),
            onChecked: (e, data) => dispatch(Actions.entityCheck(data.id)),
        });

        return React.createElement(
            connect(mapStateToProps, mapDispatchToProps)(UserCard), 
            { data }
        );
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
                        data => this.connectAndRenderUserCard(data)
                    }
                </List>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    loading: state.entities.data.loading,
    data: Selectors.getUsers(state),
    pagination: Selectors.getPagination(state),
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

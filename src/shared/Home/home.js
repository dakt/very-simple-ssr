import React from 'react';
import { connect } from 'react-redux';

import UserCard from './UserCard';


export class GistList extends React.Component {

    mouseDown = false;
    lastMouseX = null;
    positionX = null;
    cards = [];

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

    update(element, clientX) {
        // Calculate delta
        const delta = clientX - this.lastMouseX;

        // Update last mouse position
        this.lastMouseX = clientX;

        // Calcualte new position
        this.positionX = this.positionX + delta;

        window.requestAnimationFrame(() => {
            element.style.transform = `translateX(${this.positionX}px)`;
        });
    }

    reset(element) {
        // Calculate next position
        this.positionX += -(this.positionX / 4);

        element.style.transform = `translateX(${this.positionX}px)`;

        if (this.positionX !== 0) {
            window.requestAnimationFrame(() => this.reset(element));
        }        
    }

    handleMouseDown(event) {
        this.mouseDown = true;
        this.positionX = 0;
        this.lastMouseX = event.clientX;
    }

    handleMouseMove(event) {
        const element = event.currentTarget;
        if (this.mouseDown) {
            this.update(element, event.clientX);
        }
    }

    handleMouseUp(event) {
        const element = event.currentTarget;
        this.mouseDown = false;
        setTimeout(() => {
            window.requestAnimationFrame(() => this.reset(element));
        }, 100);
    }

    handleTouchStart(event) {
        const element = event.currentTarget;
        this.mouseDown = true;
        this.positionX = 0;
        this.lastMouseX = event.clientX || event.touches[0].clientX;
    }

    handleTouchMove(event) {
        const element = event.currentTarget;
        if (this.mouseDown) {
            this.update(element, event.clientX || event.touches[0].clientX);
        }
    }

    handleTouchEnd(event) {
        const element = event.currentTarget;
        this.mouseDown = false;
        setTimeout(() => {
            window.requestAnimationFrame(() => this.reset(element));
        }, 100);
    }

    render() {
        const { data, pagination: { page, limit, count } } = this.props;

        const totalPages = (count / limit);

        return (
            <div style={{ overflowX: "hidden" }}>
                {data.map(user => (
                    <UserCard
                        key={user.id}
                        data={user}
                        //cardRef={node => this.cards.push(node)}
                        onMouseDown={(e) => this.handleMouseDown(e)}
                        onMouseUp={(e) => this.handleMouseUp(e)}
                        onMouseMove={(e) => this.handleMouseMove(e)}
                        onTouchStart={(e) => this.handleTouchStart(e)}
                        onTouchEnd={(e) => this.handleTouchEnd(e)}
                        onTouchMove={(e) => this.handleTouchMove(e)}
                    />
                ))}
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    loading: state.gist.loading,
    data: state.gist.data,
    pagination: state.gist.pagination,
});

export default connect(mapStateToProps)(GistList);
import React from 'react';
import { connect } from 'react-redux';


export class GistList extends React.Component {

    mouseDown = false;
    mouseX = 0;
    delta = 0;

    element = null;
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

    componentDidMount() {
        window.requestAnimationFrame(this.handleAnimationFrameChange);
    }

    handleAnimationFrameChange = (timestamp) => {

        console.log('!');



        
    }

    handleMouseDown(event) {
        this.element = event.currentTarget;
        this.mouseX = event.clientX;
        this.mouseDown = true;
    }

    handleMouseMove(event) {
        const element = event.currentTarget;

        if(this.mouseDown) {
            //window.requestAnimationFrame(this.handleAnimationFrameChange);

            const newDelta = (event.clientX - this.mouseX);

            this.delta = newDelta;

            this.mouseX = this.mouseX + newDelta;
            this.element.style.transform = `translateX(${this.mouseX}px)`;
        }

    }

    handleMouseUp(event) {
        this.mouseDown = false;
        this.element = null;
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
                        ref={node => this.cards.push(node)}
                        onMouseDown={(e) => this.handleMouseDown(e)}
                        onMouseUp={(e) => this.handleMouseUp(e)}
                        onMouseMove={(e) => this.handleMouseMove(e)}
                    />
                ))}
            </div>
        );
    }
}

class UserCard extends React.Component {
    render() {
        return (
            <div className="userCard" {...this.props}>
                <div className="userName">{this.props.data.name}</div>
                <div className="userEmail">{this.props.data.email}</div>
            </div>
        );
    }
};

const mapStateToProps = (state) => ({
    loading: state.gist.loading,
    data: state.gist.data,
    pagination: state.gist.pagination,
});

export default connect(mapStateToProps)(GistList);
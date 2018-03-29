import React from 'react';
import PropTypes from 'prop-types';


function getDocumentHeight() {
    const D = document;
    return Math.max(
        D.body.scrollHeight, D.documentElement.scrollHeight,
        D.body.offsetHeight, D.documentElement.offsetHeight,
        D.body.clientHeight, D.documentElement.clientHeight,
    );
}


export default class VirtualScroller extends React.Component {

    constructor(props) {
        super(props);

        this.handleScroll = this.handleScroll.bind(this);
    }

    componentDidMount() {
        this.attachScrollHandler();
    }

    attachScrollHandler() {
        window.addEventListener('scroll', this.handleScroll, true);
        window.addEventListener('mousewheel', this.handleScroll, true);
    }

    detachScrollHandler() {
        window.removeEventListener('scroll', this.handleScroll, true);
        window.removeEventListener('mousewheel', this.handleScroll, true);
    }

    handleScroll(event) {
        const windowHeight = window.innerHeight ||
            (document.documentElement || document.body).clientHeight;

        const documentHeight = getDocumentHeight();

        const scrolledTop = window.pageYOffset ||
            (document.documentElement || document.body.parentNode || document.body).scrollTop;

        const percentScrolled = Math.floor((scrolledTop / (documentHeight - windowHeight)) * 100);

        if (percentScrolled > this.props.threshold) {
            this.detachScrollHandler();
            this.props.onNearEnd();
        }
    }

    render() {
        return (
            <div>
                {this.props.children}
            </div>
        );
    }
};


VirtualScroller.defaultProps = {
    threshold: 80,
    onNearEnd: f => f,
};

VirtualScroller.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.array,
    ]).isRequired,
    threshold: PropTypes.number,
    onNearEnd: PropTypes.func,
};

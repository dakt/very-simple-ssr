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
        this.preventScrollRestoration();
        this.attachScrollHandler();
    }

    componentDidUpdate() {
        this.attachScrollHandler();
    }

    componentWillUnmount() {
        this.detachScrollHandler();
    }

    /*
     * So far only in Chrome...
     * Prevent scroll hiccup during page load when browser tries to
     * restore the scroll on popState. This can cause unwanted event fireing
     * as soon as we attach scroll handlers.
     */
    preventScrollRestoration() {
        // https://developers.google.com/web/updates/2015/09/history-api-scroll-restoration
        // Maybe we should put this in header?
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }
    }

    attachScrollHandler() {
        if (this.props.hasMore === false) {
            window.addEventListener('scroll', this.handleScroll, true);
            window.addEventListener('mousewheel', this.handleScroll, true);
        }
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
}

VirtualScroller.defaultProps = {
    threshold: 80,
    onNearEnd: f => f,
};

VirtualScroller.propTypes = {
    hasMore: PropTypes.bool.isRequired,
    children: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.array,
    ]).isRequired,
    threshold: PropTypes.number,
    onNearEnd: PropTypes.func,
};

import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import styles from './List.css';
import VirtualScroller from '../components/VirtualScroller';


export default class List extends React.Component {
    state = {
        isLoading: false,
        isStillLoading: false,
    }

    componentWillReceiveProps(nextProps) {
        this.throttleLoadingIndicator(nextProps);
    }

    trackMouse = false;
    lastMouseX = null;
    lastMouseY = null;
    positionX = null;

    throttleLoadingIndicator(nextProps) {
        this.setState({ isLoading: nextProps.loading });

        setTimeout(() => {
            this.setState({ isStillLoading: this.state.isLoading });
        }, this.props.waitTrashold);
    }

    handleSlideUpAnimationComplete(event) {
        const node = event.target;
        node.removeEventListener('transitionend', this.handleSlideUpAnimationComplete);
        node.style.transition = null;
        node.style.transform = null;
    }

    repositionNodesBelow(element, data) {
        const allNodes = [...this.list.childNodes];
        const nodeIndex = allNodes.findIndex(node => node === element) + 1;

        // Hide node in order to trigger nodes below to reposition
        element.style.display = 'none';

        // For every node below...
        for (let i = nodeIndex; i < allNodes.length; i += 1) {
            const node = allNodes[i];

            // Freeze node in place
            node.addEventListener('transitionend', this.handleSlideUpAnimationComplete);
            node.style.transform = `translateY(${node.offsetHeight}px)`;
        }

        // Wait for next repaint (next frame) to start animation
        window.requestAnimationFrame(() => {
            for (let i = nodeIndex; i < allNodes.length; i += 1) {
                const node = allNodes[i];

                node.style.transition = 'transform 350ms';
                node.style.transform = null;
            }

            // We are done and ready for rerender
            this.props.onRemove(data);
        });
    }

    updatePosition(element, deltaX) {
        // Calcualte new position
        this.positionX = this.positionX + deltaX;

        window.requestAnimationFrame(() => {
            element.style.transform = `translateX(${this.positionX}px)`;
        });
    }

    resetPosition(element) {
        // Calculate next position
        this.positionX += -(this.positionX / 4);

        element.style.transform = `translateX(${this.positionX}px)`;

        if (this.positionX > 0.1 || this.positionX < -0.1) {
            window.requestAnimationFrame(() => this.resetPosition(element));
        } else {
            this.positionX = 0;
            element.removeAttribute('style');
        }
    }

    leaveScreen(element, data) {
        // Calculate next position
        this.positionX += 30;

        element.style.transform = `translateX(${this.positionX}px)`;

        if (this.positionX < document.documentElement.clientWidth) {
            window.requestAnimationFrame(() => this.leaveScreen(element, data));
        } else {
            this.repositionNodesBelow(element, data);
        }
    }

    release(element, data) {
        this.trackMouse = false;

        if (this.positionX > element.parentNode.offsetWidth * 0.4) {
            window.requestAnimationFrame(() => this.leaveScreen(element, data));
        } else {
            window.requestAnimationFrame(() => this.resetPosition(element));
        }
    }

    /* *********** Mouse handlers *********** */

    handleMouseDown(event) {
        this.isInitial = true;
        this.trackMouse = true;
        this.positionX = 0;

        this.lastMouseX = event.clientX;
        this.lastMouseY = event.clientY;
    }

    handleMouseUp(event, data) {
        const element = event.currentTarget;
        this.release(element, data);
    }

    handleMouseMove(event) {
        const element = event.currentTarget;

        const thisMouseX = event.clientX;
        const thisMouseY = event.clientY;

        const deltaX = thisMouseX - this.lastMouseX;
        const deltaY = thisMouseY - this.lastMouseY;

        this.lastMouseX = thisMouseX;
        this.lastMouseY = thisMouseY;

        if (this.trackMouse) this.updatePosition(element, deltaX);
    }

    handleMouseEnter() {
        this.positionX = 0;
    }

    handleMouseLeave(event, data) {
        const element = event.currentTarget;
        if (this.trackMouse) this.release(element, data);
    }

    /* *********** Touch handlers *********** */

    handleTouchStart(event) {
        this.isInitial = true;
        this.trackMouse = true;
        this.positionX = 0;

        this.lastMouseX = event.clientX || event.touches[0].clientX;
        this.lastMouseY = event.clientY || event.touches[0].clientY;
    }

    handleTouchMove(event) {
        const element = event.currentTarget;

        const thisMouseX = event.clientX || event.touches[0].clientX;
        const thisMouseY = event.clientY || event.touches[0].clientY;

        const deltaX = thisMouseX - this.lastMouseX;
        const deltaY = thisMouseY - this.lastMouseY;

        this.lastMouseX = thisMouseX;
        this.lastMouseY = thisMouseY;

        const isVertical = Math.abs(deltaY / deltaX) > 1;

        if (this.isInitial) {
            this.isInitial = false;
            
            if (isVertical) {
                this.trackMouse = false;
                return;
            }
        }

        if (this.trackMouse) {
            this.updatePosition(element, deltaX);
        }
    }

    handleTouchEnd(event, data) {
        const element = event.currentTarget;
        this.release(element, data);

        this.lastMouseX = null;
        this.lastMouseY = null;
    }

    render() {
        return (
            <VirtualScroller
                onNearEnd={this.props.onNearEnd}
                hasMore={this.props.loading}
                threshold={70}
            >
                <div className={styles.container} ref={(node) => { this.list = node; }}>
                    {this.props.data.map(d => (
                        <div
                            role="presentation"
                            className={styles.item}
                            key={d[this.props.idField]}
                            /** Mouse events */
                            onMouseDown={e => this.handleMouseDown(e, d)}
                            onMouseUp={e => this.handleMouseUp(e, d)}
                            onMouseMove={e => this.handleMouseMove(e, d)}
                            onMouseEnter={e => this.handleMouseEnter(e, d)}
                            onMouseLeave={e => this.handleMouseLeave(e, d)}
                            /** Touch events */
                            onTouchStart={e => this.handleTouchStart(e, d)}
                            onTouchEnd={e => this.handleTouchEnd(e, d)}
                            onTouchMove={e => this.handleTouchMove(e, d)}
                        >
                            {this.props.children(d)}
                        </div>
                    ))}
                </div>
                <div className={cx(styles.loadingContainer, { visible: this.state.isStillLoading })}>
                    <div>
                        Loading...
                    </div>
                </div>
            </VirtualScroller>
        );
    }
}

List.defaultProps = {
    children: null,
    idField: 'id',
    data: [],
    loading: false,
    waitTrashold: 1000,
    onRemove: f => f,
    onNearEnd: f => f,
};

List.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.array,
        PropTypes.func,
    ]),
    idField: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    data: PropTypes.arrayOf(PropTypes.object),
    loading: PropTypes.bool,
    waitTrashold: PropTypes.number,
    onRemove: PropTypes.func,
    onNearEnd: PropTypes.func,
};

import React from 'react';


export default class List extends React.Component {

    mouseDown = false;
    mouseOver = false;
    lastMouseX = null;
    positionX = null;

    reset() {
        this.mouseDown = false;
        this.mouseOver = false;
    }

    updatePosition(element, clientX) {
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

    resetPosition(element) {
        // Calculate next position
        this.positionX += -(this.positionX / 4);

        element.style.transform = `translateX(${this.positionX}px)`;

        if (this.positionX > 0.1 || this.positionX < -0.1)
        {
            window.requestAnimationFrame(() => this.resetPosition(element));
        }
        else
        {
            this.positionX = 0;
            element.removeAttribute('style');
        }
    }

    leaveScreen(element) {
        // Calculate next position
        this.positionX += 30;

        element.style.transform = `translateX(${this.positionX}px)`;

        if (this.positionX < document.documentElement.clientWidth)
        {
            window.requestAnimationFrame(() => this.leaveScreen(element));
        }
    }

    swipe(element, data) {
        if (this.positionX > element.parentNode.offsetWidth * 0.4) 
        {
            window.requestAnimationFrame(() => this.leaveScreen(element));
            this.props.onRemove(data);
        }
        else 
        {
            setTimeout(() => {
                window.requestAnimationFrame(() => this.resetPosition(element));
            }, 100);
        }
    }

    /**** Mouse events ****/

    handleMouseDown(event) {
        this.positionX = 0;
        this.mouseDown = true;
        this.lastMouseX = event.clientX;
    }

    handleMouseUp(event, data) {
        const element = event.currentTarget;
        this.mouseDown = false;
        this.swipe(element, data);
    }

    handleMouseMove(event) {
        const element = event.currentTarget;

        if (this.mouseDown && this.mouseOver)
        {
            this.updatePosition(element, event.clientX);
        }
    }

    handleMouseEnter(event) {
        this.mouseOver = true;
    }

    handleMouseLeave(event, data) {
        console.log('leave')
        const element = event.currentTarget;
        this.reset();
        this.swipe(element, data);
    }

    /**** Touch events ****/

    handleTouchStart(event) {
        const element = event.currentTarget;
        this.mouseDown = true;
        this.positionX = 0;
        this.lastMouseX = event.clientX || event.touches[0].clientX;
    }

    handleTouchMove(event) {
        const element = event.currentTarget;
        if (this.mouseDown)
        {
            this.updatePosition(element, event.clientX || event.touches[0].clientX);
        }
    }

    handleTouchEnd(event) {
        const element = event.currentTarget;
        this.mouseDown = false;
        this.swipe(element);
    }

    render() {
        return (
            <div style={{ overflowX: "hidden" }}>
                {this.props.data.map(d => (
                    <div
                        key={d[this.props.idField]}
                        /** Mouse events */
                        onMouseDown={(e) => this.handleMouseDown(e, d)}
                        onMouseUp={(e) => this.handleMouseUp(e, d)}
                        onMouseMove={(e) => this.handleMouseMove(e, d)}
                        onMouseEnter={(e) => this.handleMouseEnter(e, d)}
                        onMouseLeave={(e) => this.handleMouseLeave(e, d)}
                        /** Touch events */
                        onTouchStart={(e) => this.handleTouchStart(e, d)}
                        onTouchEnd={(e) => this.handleTouchEnd(e, d)}
                        onTouchMove={(e) => this.handleTouchMove(e, d)}
                    >
                        {this.props.children(d)}
                    </div>
                ))}
            </div>
        );
    }
}

List.defaultProps = {
    idField: "id",
    onRemove: f => f,
};
import React from 'react';


export default class List extends React.Component {

    trackMouse = false;
    lastMouseX = null;
    positionX = null;

    repositionNodesBelow(element, data) {

        let isBelow = false;
        this.list.childNodes.forEach(node => {
            if (node === element) 
            {
                isBelow = true;
            }
            else if (isBelow)
            {
                window.requestAnimationFrame(() => this.moveUp(node, data, 1))        
            }
        });
    }

    moveUp(element, data, step) {
        const pixelOffset = step * 8;
        element.style.transform = `translateY(${-pixelOffset}px)`;

        if (pixelOffset <= element.offsetHeight)
        {
            window.requestAnimationFrame(() => this.moveUp(element, data, ++step));
        }
        else
        {
            //this.props.onRemove(data);
        }
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

    leaveScreen(element, data) {
        // Calculate next position
        this.positionX += 30;

        element.style.transform = `translateX(${this.positionX}px)`;

        if (this.positionX < document.documentElement.clientWidth)
        {
            window.requestAnimationFrame(() => this.leaveScreen(element, data));
        }
        else
        {
            //this.list.removeChild(element);
            this.repositionNodesBelow(element, data);
        }
    }

    release(element, data) {
        this.trackMouse = false;

        if (this.positionX > element.parentNode.offsetWidth * 0.4)
        {
            window.requestAnimationFrame(() => this.leaveScreen(element, data));
        }
        else 
        {
            window.requestAnimationFrame(() => this.resetPosition(element));
        }
    }

    /************ Mouse handlers ************/

    handleMouseDown(event) {
        this.positionX = 0;
        this.trackMouse = true;
        this.lastMouseX = event.clientX;
    }

    handleMouseUp(event, data) {
        const element = event.currentTarget;
        this.release(element, data);
    }

    handleMouseMove(event) {
        const element = event.currentTarget;
        this.trackMouse && this.updatePosition(element, event.clientX);
    }

    handleMouseEnter(event) {
        this.positionX = 0;
    }

    handleMouseLeave(event, data) {
        const element = event.currentTarget;
        this.trackMouse && this.release(element, data);
    }

    /************ Touch handlers ************/

    handleTouchStart(event) {
        const element = event.currentTarget;
        this.trackMouse = true;
        this.positionX = 0;
        this.lastMouseX = event.clientX || event.touches[0].clientX;
    }

    handleTouchMove(event) {
        const element = event.currentTarget;
        if (this.trackMouse)
        {
            this.updatePosition(element, event.clientX || event.touches[0].clientX);
        }
    }

    handleTouchEnd(event) {
        const element = event.currentTarget;
        this.release(element);
    }

    render() {

        console.log('render');

        return (
            <div style={{ overflowX: "hidden" }} ref={node => this.list = node}>
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
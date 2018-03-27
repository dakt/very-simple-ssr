import React from 'react';

import UserCard from './UserCard';


export default class List extends React.Component {

    mouseDown = false;
    lastMouseX = null;
    positionX = null;

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

        if (this.positionX > 0.1 || this.positionX < -0.1) {
            window.requestAnimationFrame(() => this.reset(element));
        } else {
            this.positionX = 0;
            element.removeAttribute('style');
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
        return (
            <div style={{ overflowX: "hidden" }}>
                {this.props.data.map(user => (
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
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Notfound.css';

interface Props {
}

interface State {
    // message: message[],
    selector3: any,
    selector1: any,
    selector2: any,
    isReady: boolean
}

class NotFound extends Component<Props, State> {
    constructor(prop: Props) {
        super(prop);
        if (!this.state)
            this.state = { selector3: undefined, selector1: undefined, selector2: undefined, isReady: false };
    }

    randomNum = () => {
        "use strict";
        return Math.floor(Math.random() * 9) + 1;
    }

    componentDidMount() { 
        this.setState({selector3: document.querySelector('.thirdDigit'),selector2: document.querySelector('.secondDigit'),selector1: document.querySelector('.firstDigit'), isReady: true})
        console.log(this.state);
        
    }

    componentDidUpdate(prevProps: any, prevState: any) {

        const $this = this;
        let loop1: any, loop2: any, loop3: any, time = 30, i = 0, number;
        console.log(prevState);

        if ($this.state.isReady) {
            loop3 = setInterval(function () {
                "use strict";
                if (i > 40) {
                    clearInterval(loop3);
                    $this.state.selector3.textContent = 4;
                } else {
                    $this.state.selector3.textContent = $this.randomNum();
                    i++;
                }
            }, time);
            loop2 = setInterval(function () {
                "use strict";
                if (i > 80) {
                    clearInterval(loop2);
                    $this.state.selector2.textContent = 0;
                } else {
                    $this.state.selector2.textContent = $this.randomNum();
                    i++;
                }
            }, time);
            loop1 = setInterval(function () {
                "use strict";
                if (i > 100) {
                    clearInterval(loop1);
                    $this.state.selector1.textContent = 4;
                } else {
                    $this.state.selector1.textContent = $this.randomNum();
                    i++;
                }
            }, time);
        }
    }


    render() {
        return (
            <div className="error">
                <div className="container-floud">
                    <div className="col-xs-12 ground-color text-center">
                        <div className="container-error-404">
                            <div className="clip"><div className="shadow"><span className="digit thirdDigit"></span></div></div>
                            <div className="clip"><div className="shadow"><span className="digit secondDigit"></span></div></div>
                            <div className="clip"><div className="shadow"><span className="digit firstDigit"></span></div></div>
                            <div className="msg">OH!<span className="triangle"></span></div>
                        </div>
                        <h2 className="h1">Sorry! Page not found</h2>
                    </div>
                </div>
            </div>
        );
    }
}

export default NotFound;
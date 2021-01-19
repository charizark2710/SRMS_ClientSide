import { waitFor } from '@testing-library/react';
import React, { ChangeEvent, Component, useCallback, useContext } from 'react';
import { db, client } from '../FireBase/config';

interface Props {
}

interface State {
    error: string,
    video: any,
}

class testML extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
        db.goOnline();
        this.state = { error: "", video: null };
    }


    componentDidMount() {
        db.goOnline();
        const video = document.getElementById('video') as HTMLVideoElement;
        const canvas = document.getElementById('canvas') as HTMLCanvasElement;
        const $this = this;
        navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
            video.srcObject = stream;
        }, e => {
            console.log(e);
            this.setState({ error: e.message! });
        }).then(() => {
            const ctx = canvas.getContext('2d');
            video.addEventListener('play', (event) => {
                function computeFrame() {
                    ctx?.drawImage(video, 0, 0);
                    setTimeout(() => { $this.addToDB(canvas) }, 500);
                }
                function step() {
                    computeFrame();
                    requestAnimationFrame(step);
                }
                requestAnimationFrame(step);
            });
        }).catch(e => {
            video.pause();
            video.currentTime = 0;
            console.log(e);
        });
    }

    addToDB = async (canvas: HTMLCanvasElement) => {
        if (canvas) {
            if ((await db.ref('video/isDone').get()).val() != false) {
                await db.ref('video').update({
                    isDone: false
                })
                await db.ref('video').update({
                    frame: canvas.toDataURL(),
                });
            }
        }
    }

    componentWillUnmount() {
        (document.getElementById('video') as HTMLVideoElement).pause();
        (document.getElementById('video') as HTMLVideoElement).currentTime = 0;
    }

    render() {
        if (!this.state.error) {
            return (
                <div>
                    <div id="container">
                        <video autoPlay={true} id="video" width="480px" height="640px" hidden={true}>

                        </video>
                        <canvas id="canvas" height="480" width="640px" />
                    </div>
                </div>);
        }
        else {
            return (<div>LOADING</div>)
        }
    }
}
export default testML
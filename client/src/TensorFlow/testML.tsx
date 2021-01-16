import React, { ChangeEvent, Component, useCallback, useContext } from 'react';
import io from "socket.io-client";
import { db, client } from '../FireBase/config';

interface Props {
}

interface State {
    error: string,
    video: any,
}

let socket: SocketIOClient.Socket;

class testML extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { error: "", video: null };
    }

    componentDidMount() {
        const video = document.getElementById('video') as HTMLVideoElement;
        const canvas = document.getElementById('canvas') as HTMLCanvasElement;
        const $this = this;
        const date = new Date();
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
                    db.ref('video').set({
                        frame: canvas.toDataURL()
                    }).catch(e => {
                        video.pause();
                        video.currentTime = 0;
                        console.log(e);
                    });
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

    componentWillUnmount() {
        socket.close();
    }

    render() {
        if (!this.state.error) {
            return (
                <div>
                    <div id="container">
                        <video autoPlay={true} id="video" width="360px" height="520px" hidden={true}>

                        </video>
                        <canvas id="canvas" height="360" width="520px" />
                    </div>
                </div>);
        }
        else {
            return (<div>LOADING</div>)
        }
    }
}
export default testML
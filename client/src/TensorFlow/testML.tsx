import React, { ChangeEvent, Component, useCallback, useContext } from 'react';
import io from "socket.io-client";
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

    configureSocket = () => {
        socket = io('http://localhost:5001', {autoConnect: true, reconnectionDelay:2000});
    }

    componentDidMount() {
        this.configureSocket();
        const video = document.getElementById('video') as HTMLVideoElement;
        const canvas = document.getElementById('canvas') as HTMLCanvasElement;
        const $this = this;

        navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
            const ctx = canvas.getContext('2d');
            video.srcObject = stream;
        }, e => {
            console.log(e);
            this.setState({ error: e.message! });
        }).then(() => {
            video.addEventListener('play', () => {
                function computeFrame() {
                    const ctx = canvas.getContext('2d');

                    ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
                    if (socket.connected) {
                        let frame = ctx?.getImageData(0, 0, canvas.width, canvas.height);
                        $this.sendData(canvas.toDataURL()!);
                    }
                }
                function step() {
                    computeFrame();
                    requestAnimationFrame(step);
                }
                requestAnimationFrame(step);
            });
        }).catch(e => {
            console.log(e);
        });
    }

    componentWillUnmount() {
        socket.disconnect();
    }

    sendData = (frame: string) => {
        console.log('1');
        if (frame)
        {
            console.log(frame);
            socket.emit('frame', frame);}
        else
            socket.emit('frame', "ERROR");
    }

    render() {
        if (!this.state.error) {
            return (
                <div>
                    <div id="container">
                        <video autoPlay={true} id="video" width="480px" height="640px" hidden={true}>

                        </video>
                        <canvas id="canvas" height="480px" width="640px" />
                    </div>
                </div>);
        }
        else {
            return (<div>LOADING</div>)
        }
    }
}
export default testML
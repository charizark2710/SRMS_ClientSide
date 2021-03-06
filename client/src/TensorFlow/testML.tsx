import { Component } from 'react';
import { io, Socket } from 'socket.io-client'
interface Props {
}

interface State {
    error: string,
    video: any,
}

class TestML extends Component<Props, State> {

    clientSocket: Socket;
    constructor(props: Props) {
        super(props);
        this.state = { error: "", video: null };
        this.clientSocket = io('http://localhost:9001/', { autoConnect: true, withCredentials: true });
    }

    componentDidMount() {
        const video = document.getElementById('video') as HTMLVideoElement;
        const canvas = document.getElementById('canvas') as HTMLCanvasElement;
        const $this = this;
        this.clientSocket.on('sendNoti', (event: string) => {
            console.log(event);
            if (event === 'done') {
                this.sendToServer(canvas);
            }
        });
        this.clientSocket.off('sendNoti', (event: string) => {
            console.log(event);
            if (event === 'done') {
                this.sendToServer(canvas);
            }
        });
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

                }
                function step() {
                    computeFrame();
                    setTimeout(() => { requestAnimationFrame(step) }, 300);
                }
                requestAnimationFrame(step);
            });
        }).catch(e => {
            video.pause();
            video.currentTime = 0;
            console.log(e);
        });
    }

    sendToServer = async (canvas: HTMLCanvasElement) => {
        if (canvas) {
            this.clientSocket.emit('sendFPS', canvas.toDataURL());
        }
    }

    componentWillUnmount() {
        (document.getElementById('video') as HTMLVideoElement).pause();
        (document.getElementById('video') as HTMLVideoElement).currentTime = 0;
        this.clientSocket.close();
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
export default TestML
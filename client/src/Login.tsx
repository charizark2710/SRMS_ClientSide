import React, { ChangeEvent, Component } from 'react';
import firebase from 'firebase'
import { client } from './FireBase/config'

interface Props {
}

interface State {
    uid: string,
    idToken: string,
    name: string,
    isLoaded: boolean
}

class Login extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { idToken: '', isLoaded: false, uid: '', name: '' }
    }
    componentDidMount() {
        if (client) {
            this.setState({ isLoaded: true })
        }
    }

    googleSignIn = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider).then(async result => {
            const eType = result.user?.email!.split('@')[1];

            this.setState({
                idToken: await result.user?.getIdToken()!, name: result.user?.displayName!, uid: result.user?.uid!
            });
            fetch('http://localhost:5000/quickstart-1594476482074/us-central1/app/login', {
                headers: {
                    'content-type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify(this.state),
            }).then(res => {
                return res.json();
            }).catch(e => {
                console.log(e);
            });
            event.preventDefault();
        })
    }

    render() {
        if (this.state.isLoaded)
            return (<div>
                <button name="google sign in" onClick={this.googleSignIn}>google sign in</button>
            </div>)
        else return (<div><h1>LOADING</h1></div>)
    }
}
export default Login
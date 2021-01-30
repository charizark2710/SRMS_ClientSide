import React, { ChangeEvent, Component } from 'react';
import firebase from 'firebase'
import { client, messaging } from './FireBase/config'
import { Redirect } from 'react-router-dom'

interface Props {
}

interface State {
    uid: string,
    idToken: string,
    name: string,
    isLoaded: boolean,
    employeeId: string
}

class Login extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { idToken: '', isLoaded: false, uid: '', name: '', employeeId: '' }
    }
    componentDidMount() {
        if (client) {
            this.setState({ isLoaded: true })
        }
    }

    googleSignIn = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const provider = new firebase.auth.GoogleAuthProvider();
        client.auth().signInWithPopup(provider).then(async result => {
            this.setState({
                idToken: await result.user?.getIdToken()!, name: result.user?.displayName!, uid: result.user?.uid!, employeeId: result.user?.email?.split('@')[0]!
            });
            fetch('http://localhost:5000/booming-pride-283013/us-central1/app/login', {
                credentials: 'include',

                headers: {
                    'content-type': 'application/json',
                },

                method: 'POST',
                body: JSON.stringify(this.state),
            }).then(res => {
                if (res.ok) {
                    return res.json().then(result => {console.log(result)})
                }
                else {
                    firebase.auth().currentUser?.delete();
                    firebase.auth().signOut();
                    return res.json().then(result => { throw Error(result.error) });
                }
            }).catch(e => {
                firebase.auth().currentUser?.delete();
                firebase.auth().signOut();
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
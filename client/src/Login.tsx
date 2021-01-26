import React, { ChangeEvent, Component } from 'react';
import firebase from 'firebase'
import { client, messaging } from './FireBase/config'

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
                Notification.requestPermission().then(value => {
                    messaging.getToken({ vapidKey: "BEBvnGJooiNm5wM4kOtwbeNyjLaKhbaKPdS8vadKB5Ekq1YdXzLLNDMaNYpA0nmR-q8Glvl2r473vPZ9z1_OZvU" }).then(token => {
                        console.log(token);
                    }).catch(e => { console.error(e) });
                });
                if (res.ok) {
                    console.log(this.context.registerToken);
                    return res.json().then(result => { console.log(result) });
                }
                else {
                    firebase.auth().currentUser?.delete();
                    return res.json().then(result => { throw Error(result.error) });
                }
            }).catch(e => {
                firebase.auth().currentUser?.delete();
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
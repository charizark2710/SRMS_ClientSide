import React, { Component } from 'react';
import './Login.css';
import firebase from 'firebase'
import { client} from './../../FireBase/config';
import { Redirect } from 'react-router-dom';


interface Props {
    // propsFromLoginApp:any,
    history:any
}

interface State {
    uid: string,
    idToken: string,
    name: string,
    isLoaded: boolean,
    employeeId: string,
}


class Login extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { idToken: '', isLoaded: false, uid: '', name: '', employeeId: '' }
    }

    componentDidUpdate(){
        // common.checkFullPageBackgroundImage();
    }

    componentDidMount() {
        const script=document.createElement("script");
        script.src='customJS/loadBackground.js';
        script.async=true;
        document.body.appendChild(script);
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
            fetch('http://localhost:5000/login', {
                credentials: 'include',

                headers: {
                    'content-type': 'application/json',
                },

                method: 'POST',
                body: JSON.stringify(this.state),
            }).then( async res => {
                if (res.ok) {
                    await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
                    const role = await res.json();
                    if(role.role === 'admin'){
                         this.props.history.push("/adminHomePage");
                    }else{
                        this.props.history.push("/userHomePage");
                    }
                    return
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
            return (
                <div>
                    <nav className="navbar navbar-primary navbar-transparent navbar-absolute">
                        <div className="container">
                            <div className="navbar-header">
                                <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#navigation-example-2">
                                    <span className="sr-only">Toggle navigation</span>
                                    <span className="icon-bar"></span>
                                    <span className="icon-bar"></span>
                                    <span className="icon-bar"></span>
                                </button>
                                <img src='/img/fpt-logo.png' className="logoFPT" />

                            </div>
                        </div>
                    </nav>
                    <div className="wrapper wrapper-full-page">
                        <div className="full-page pricing-page" data-image={process.env.PUBLIC_URL + '/img/fpt-bg3.png'}>
                            <div className="content">
                                <div className="container">
                                    <div className="row">
                                        <div className="col-md-6 col-md-offset-3 text-center">
                                            <h2 className="title">Pick the best plan for you</h2>
                                            <h5 className="description">You have Free Unlimited Updates and Premium Support on each package.</h5>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="containerLoginWithGG">
                                            <button type="button" className="btnLoginWithGG btn" onClick={this.googleSignIn}>
                                                <img src={process.env.PUBLIC_URL + 'img/googleSignIn.png'} alt="" className="imgLoginWithGG" />
                                                <span className="textLoginWithGG">Login with google</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            )
        else return (<div><h1>LOADING</h1></div>)
    }
}

// const mapStateToProps = (state:any) => {
//     console.log(state);

//     return {
//         loggedInUser: state.loggedInUser
//     }
// }
// const mapDispatchToProps=(dispatch:any, props:any)=>{
//     return{
//         googleSignIn:()=>{
//         dispatch(googleleSignInRequest());
//       }
//     }
//   }
// export default connect(mapStateToProps, mapDispatchToProps)(Login);
export default Login;

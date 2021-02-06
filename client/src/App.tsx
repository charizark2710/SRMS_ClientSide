import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import ReactDOM from 'react-dom';
import Login from './Login'
import testML from './TensorFlow/testML'
import { db, client } from './FireBase/config'
import message from './model/Message'
import firebase from 'firebase'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

interface Props {
}

interface State {
  message: message[],
  isLogged: boolean,
  uid: string,
  idToken: string,
  name: string,
  employeeId: string,
  isDone: boolean
}


class App extends Component<Props, State>{
  constructor(prop: Props) {
    super(prop);
    if (!this.state)
      this.state = { message: [], isLogged: false, idToken: '', uid: '', name: '', employeeId: '', isDone: false };
  }

  notificationManagement = (user: firebase.User) => {
    this.setState({ message: [] });
    const userEmail = user.email?.split('@')[0] || ' ';
    this.setState({ isLogged: true });
    db.ref('notification'.concat('/', userEmail)).on('child_added', snap => {
      const mail: message = snap.val();
      if (!mail.isRead) {
        this.setState({ message: [... this.state.message, mail] })
      }
    });
    db.ref('notification'.concat('/', userEmail)).off('child_added', (snap) => {
      const mail: message = snap.val();
      if (!mail.isRead) {
        this.setState({ message: [... this.state.message, mail] })
      }
    });
    db.ref('notification'.concat('/', userEmail)).on('child_changed', snap => {
      const mail: message = snap.val();
      if (mail.isRead) {
        const arr = this.state.message;
        const newArr = arr.filter(mess => {
          return (mess.sendAt !== mail.sendAt);
        })
        this.setState({ message: newArr })
      }
    });
    db.ref('notification'.concat('/', userEmail)).off('child_changed', (snap) => {
      const mail: message = snap.val();
      if (mail.isRead) {
        const arr = this.state.message;
        const newArr = arr.filter(mess => {
          return (mess.sendAt !== mail.sendAt);
        })
        this.setState({ message: newArr })
      }
    });

    db.ref('notification'.concat('/', userEmail)).on('child_removed', snap => {
      const mail: message = snap.val();
      if (!mail.isRead) {
        const arr = this.state.message;
        const newArr = arr.filter(mess => {
          return mess !== mail;
        })
        this.setState({ message: newArr })
      }
    });

    db.ref('notification'.concat('/', userEmail)).off('child_removed', snap => {
      const mail: message = snap.val();
      if (!mail.isRead) {
        const arr = this.state.message;
        const newArr = arr.filter(mess => {
          return mess !== mail;
        })
        this.setState({ message: newArr })
      }
    });

  }

  componentDidMount() {
    fetch('http://localhost:5000/booming-pride-283013/us-central1/app', {
      credentials: 'include',
    }).then(res => {
      this.setState({ isDone: true });
      if (res.ok) {
        client.auth().onAuthStateChanged(user => {
          if (user) {
            this.notificationManagement(user);
          } else {
            this.setState({ isLogged: false });
          }
        });
      }
    }).catch(e => {
      this.setState({ isDone: true, isLogged: false });
      throw new Error(e);
    })
  }

  logout = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    this.setState({ isDone: false });
    fetch('http://localhost:5000/booming-pride-283013/us-central1/app/logout', {
      credentials: "include",
      method: 'POST',
    }).then(async res => {
      try {
        if (res.ok) {
          await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);
          this.setState({ isLogged: false, isDone: true });
          firebase.auth().signOut();
        } else {
          res.json().then(result => {
            throw Error(result);
          });
        }
      } catch (error) {
        throw Error(error);
      }
    }).catch(e => {
      throw Error(e);
    });
  }

  googleSignIn = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    client.auth().signInWithPopup(provider).then(async result => {
      const user = result.user;
      this.setState({
        isDone: false, idToken: await user?.getIdToken()!, name: user?.displayName!, uid: user?.uid!, employeeId: user?.email?.split('@')[0]!
      });
      fetch('http://localhost:5000/booming-pride-283013/us-central1/app/login', {
        credentials: 'include',

        headers: {
          'content-type': 'application/json',
        },

        method: 'POST',
        body: JSON.stringify(this.state),
      }).then(async res => {
        if (res.ok) {
          this.setState({ isLogged: true, isDone: true });
          this.notificationManagement(user!);
          return res.json().then(result => { console.log(result) })
        }
        else {
          firebase.auth().currentUser?.delete();
          firebase.auth().signOut();
          this.setState({ isLogged: false });
          return res.json().then(result => { throw Error(result.error) });
        }
      }).catch(async e => {
        this.setState({ isLogged: false, isDone: true });
        firebase.auth().currentUser?.delete();
        firebase.auth().signOut();
        console.log(e);
      });
      event.preventDefault();
    })
  }

  render() {
    if (this.state.isDone) {
      return (
        <div className="App">
          {this.state.isLogged ?
            (<div>
              <div>there are {this.state.message.length} messages</div>
              {this.state.message.map(m => <div>{!m.isRead ? m.message : ''}</div>)}
              <button name="Logout" onClick={this.logout}>Logout</button>
            </div>) : <button name="google sign in" onClick={this.googleSignIn}>google sign in</button>
          }
          <Route path='/login' component={Login}></Route>
          <Route path='/testML' component={testML}></Route>
        </div>
      );
    } else return (<div><h1>LOADING</h1></div>)
  }
}
export default App;

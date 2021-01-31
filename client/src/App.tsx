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

  componentDidMount() {
    fetch('http://localhost:5000/booming-pride-283013/us-central1/app', {
      credentials: 'include',
    }).then(res => {
      if (res.ok) {
        this.setState({ isDone: true });
        client.auth().onAuthStateChanged(user => {
          if (user) {
            this.setState({ isLogged: true });
            db.ref('notification'.concat('/', user.uid)).on('child_added', snap => {
              const mail: message = snap.val();
              if (!mail.isRead) {
                this.setState({ message: [... this.state.message, mail] })
              }
            });
            db.ref('notification'.concat('/', user.uid)).off('child_added', (snap) => {
              const mail: message = snap.val();
              if (!mail.isRead) {
                this.setState({ message: [... this.state.message, mail] })
              }
            });
            db.ref('notification'.concat('/', user.uid)).on('child_changed', snap => {
              const mail: message = snap.val();
              if (mail.isRead) {
                const arr = this.state.message;
                const newArr = arr.filter(mess => {
                  return (mess.sendAt !== mail.sendAt);
                })
                this.setState({ message: newArr })
              }
            });
            db.ref('notification'.concat('/', user.uid)).off('child_changed', (snap) => {
              const mail: message = snap.val();
              if (mail.isRead) {
                const arr = this.state.message;
                const newArr = arr.filter(mess => {
                  return (mess.sendAt !== mail.sendAt);
                })
                this.setState({ message: newArr })
              }
            });

            db.ref('notification'.concat('/', user.uid)).on('child_removed', snap => {
              const mail: message = snap.val();
              if (!mail.isRead) {
                const arr = this.state.message;
                const newArr = arr.filter(mess => {
                  return mess !== mail;
                })
                this.setState({ message: newArr })
              }
            });

            db.ref('notification'.concat('/', user.uid)).off('child_removed', snap => {
              const mail: message = snap.val();
              if (!mail.isRead) {
                const arr = this.state.message;
                const newArr = arr.filter(mess => {
                  return mess !== mail;
                })
                this.setState({ message: newArr })
              }
            });
          } else {
            this.setState({ isLogged: false });
          }
        });
      }
    })
  }

  logout = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    this.setState({ isDone: false });
    fetch('http://localhost:5000/booming-pride-283013/us-central1/app/logout', {
      credentials: "include",
      method: 'POST',
    }).then(res => {
      try {
        if (res.ok) {
          this.setState({ isLogged: false, isDone: true });
          firebase.auth().signOut();
          console.log('Tra ve trang dang nhap');
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
    client.auth().signInWithPopup(provider).then(async result => {
      this.setState({
        isDone: false, idToken: await result.user?.getIdToken()!, name: result.user?.displayName!, uid: result.user?.uid!, employeeId: result.user?.email?.split('@')[0]!
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
          this.setState({ isLogged: true, isDone: true });
          return res.json().then(result => { console.log(result) })
        }
        else {
          firebase.auth().currentUser?.delete();
          firebase.auth().signOut();
          this.setState({ isLogged: false });
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

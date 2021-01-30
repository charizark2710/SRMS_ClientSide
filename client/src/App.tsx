import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import ReactDOM from 'react-dom';
import Login from './Login'
import testML from './TensorFlow/testML'
import { db, client } from './FireBase/config'
import message from './model/Message'

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
  isLogged: boolean
}


class App extends Component<Props, State>{
  constructor(prop: Props) {
    super(prop);
    if (!this.state?.message)
      this.state = { message: [], isLogged: false };
  }

  componentDidMount() {
    fetch('http://localhost:5000/booming-pride-283013/us-central1/app', {
      credentials: 'include',
    }).then(res => {
      if (res.ok) {
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
          }
        });
      }
    })


  }

  render() {
    return (
      <div className="App">
        {this.state.isLogged ?
          (<div>
            <div>there are {this.state.message.length} messages</div>
            {this.state.message.map(m => <div>{!m.isRead ? m.message : ''}</div>)}
          </div>) : <div></div>
        }
        <Route path='/login' component={Login}></Route>
        <Route path='/testML' component={testML}></Route>
      </div>
    );
  }
}

export default App;

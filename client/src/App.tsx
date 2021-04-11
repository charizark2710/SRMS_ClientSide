import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import ReactDOM from 'react-dom';
import Login from './Components/Login/Login'
import testML from './TensorFlow/testML'
import { db, client } from './FireBase/config'
import message from './model/Message'
import firebase from 'firebase'
import UserHomePage from './Components/User/UserHomePage'
import AdminHomePage from './Components/Admin/AdminHomePage'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  RouteComponentProps
} from "react-router-dom";
interface MatchParams {
  name: string;
}

interface MatchProps extends RouteComponentProps<MatchParams> {
}
interface Props {
}

interface State {
  // message: message[],
  isLogged: boolean,
  uid: string,
  idToken: string,
  name: string,
  employeeId: string,
  isDone: boolean,
  currentUser: any
}


class App extends Component<Props, State>{
  constructor(prop: Props) {
    super(prop);
    if (!this.state)
      this.state = { isLogged: false, idToken: '', uid: '', name: '', employeeId: '', isDone: false, currentUser: {} };
    //this.state = { message: [], isLogged: false, isDone: false, currentUser: {} };
  }

  
  componentDidMount() {
    fetch('http://localhost:5000', {
      credentials: 'include',
    }).then(res => {
      this.setState({ isDone: true });
      if (res.ok) {
        
      }
    }).catch(e => {
      this.setState({ isDone: true, isLogged: false });
      throw new Error(e);
    })
  }

  // logout = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
  //   this.setState({ isDone: false });
  //   fetch('http://localhost:5000/logout', {
  //     credentials: "include",
  //     method: 'POST',
  //   }).then(async res => {
  //     try {
  //       if (res.ok) {
  //         await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);
  //         this.setState({ isLogged: false, isDone: true });
  //         localStorage.clear();
  //         firebase.auth().signOut();
  //       } else {
  //         res.json().then(result => {
  //           throw Error(result);
  //         });
  //       }
  //     } catch (error) {
  //       throw Error(error);
  //     }
  //   }).catch(e => {
  //     throw Error(e);
  //   });
  // }

  // googleSignIn = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
  //   const provider = new firebase.auth.GoogleAuthProvider();
  //   provider.setCustomParameters({
  //     prompt: 'select_account'
  //   });
  //   client.auth().signInWithPopup(provider).then(async result => {
  //     const user = result.user;
  //     this.setState({
  //       isDone: false, idToken: await user?.getIdToken()!, name: user?.displayName!, uid: user?.uid!, employeeId: user?.email?.split('@')[0]!
  //     });
  //     fetch('http://localhost:5000/login', {
  //       credentials: 'include',

  //       headers: {
  //         'content-type': 'application/json',
  //       },

  //       method: 'POST',
  //       body: JSON.stringify(this.state),
  //     }).then(async res => {
  //       if (res.ok) {
  //         var currentUserInfo={
  //           employeeId:this.state.employeeId,
  //           name: this.state.name
  //       }
  //         localStorage.setItem('currentUser', JSON.stringify(currentUserInfo));
  //         this.setState({ isLogged: true, isDone: true });
  //         this.notificationManagement(user!);
  //         return res.json().then(result => { console.log(result) })
  //       }
  //       else {
  //         firebase.auth().currentUser?.delete();
  //         firebase.auth().signOut();
  //         this.setState({ isLogged: false });
  //         return res.json().then(result => { throw Error(result.error) });
  //       }
  //     }).catch(async e => {
  //       this.setState({ isLogged: false, isDone: true });
  //       firebase.auth().currentUser?.delete();
  //       firebase.auth().signOut();
  //       console.log(e);
  //     });
  //     event.preventDefault();
  //   })
  // }




  // propsFromLogin = (loginData: any) => {
  //   this.setState({
  //     currentUser: loginData
  //   })   
  // }
  render() {
    // if (this.state.isDone) {
    // console.log('there are' + this.state.message.length + 'messages');
    // this.state.message.map(m => console.log(!m.isRead ? m.message : ''));

    return (
        <Switch>
          <Route path='/' exact component={Login} ></Route>
          <Route path='/userHomePage' component={UserHomePage}></Route>
          {/* <Route path='/adminHomePage' component={AdminHomePage}></Route> */}
          {/* <Route path='/adminHomePage'>
            <AdminHomePage messagesToAdmin={this.state.message}/>
          </Route>  */}
          <Route path="/adminHomePage" render={({ match }: MatchProps) => (
            <AdminHomePage match={match}/>)} /> 
           {/* messagesToAdmin={this.state.message} */}
          <Route path='/testML' component={testML}></Route>

        </Switch>
    );
    // } else return (<div><h1>LOADING</h1></div>)

    // //if (this.state.isDone) {
    // return (
    //   <Router>
    //     <div className="App">
    //       {/* <Route path='/login'>
    //         <Login propsFromLoginApp={this.propsFromLogin}/>
    //       </Route>
    //       <Route path='/userHomePage'>
    //         <UserHomePage propsFromLoginToUser={this.state.currentUser}/>
    //       </Route> */}
    //       <Route path='/login' component={Login} ></Route> 
    //       <Route path='/userHomePage' component={UserHomePage}></Route>
    //       <Route path='/adminHomePage' component={AdminHomePage}></Route>
    //       <Route path='/testML' component={testML}></Route>
    //     </div>
    //   </Router>
    // );
    //} 
    //// else return (<div><h1>LOADING</h1></div>)
  }
}
export default App;

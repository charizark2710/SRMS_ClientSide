import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Login from './Components/Login/Login'
import testML from './TensorFlow/testML'
import UserHomePage from './Components/User/UserHomePage'
import AdminHomePage from './Components/Admin/AdminHomePage'
import NotFound from './Components/Error/Notfound';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";
// interface MatchParams {
//   name: string;
// }

// interface MatchProps extends RouteComponentProps<MatchParams> {
// }
interface Props {
}

interface State {
  // message: message[],
  role?: string,
  isDone: boolean,
}


class App extends Component<Props, State>{
  constructor(prop: Props) {
    super(prop);
    if (!this.state)
      this.state = { role: undefined, isDone: false };
  }


  componentDidMount() {
    let crole = '';
    fetch('http://localhost:5000', {
      credentials: 'include',
    }).then(async res => {
      if (res.ok) {
        const result = await res.json();
        crole = result.role;
      }
    }).then(() => {
      if (crole === 'admin') {
        this.setState({ role: crole, isDone: true });
      } else {
        this.setState({ role: crole, isDone: true });
      }
    }).catch(e => {
      throw new Error(e);
    })
  }

  render() {
    if (this.state.role && this.state.role === 'admin') {
      return (
        <Switch>
          <Route path="/adminHomePage" render={({ match, history }) => (
            <AdminHomePage match={match} history={history} />)} />
          <Route path='/testML' component={testML}></Route>
          <Route component={NotFound} exact={true}></Route>
        </Switch>
      );
    } else if (this.state.role && this.state.role !== 'admin') {
      return (
        <Switch>
          <Route path='/userHomePage' component={UserHomePage}></Route>
          <Route path='/testML' component={testML}></Route>
          <Route component={NotFound} exact={true}></Route>
        </Switch>
      );
    } else {
      return (
        <Switch>
          <Route path='/' exact component={Login} ></Route>
          <Route path='/testML' component={testML}></Route>
          <Route component={NotFound} exact={true}></Route>
        </Switch>
      );
    }
  }
}
export default App;

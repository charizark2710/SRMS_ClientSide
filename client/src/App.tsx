import { Component } from 'react';
import './App.css';
import Login from './Components/Login/Login'
import testML from './TensorFlow/testML'
import UserHomePage from './Components/User/UserHomePage'
import AdminHomePage from './Components/Admin/AdminHomePage'
import NotFound from './Components/Error/Notfound';

import {
  Switch,
  Route,
} from "react-router-dom";

interface Props {
}

interface State {
  role?: string,
  isDone: boolean,
}


class App extends Component<Props, State>{
  constructor(prop: Props) {
    super(prop);
    if (!this.state)
      this.state = { role: undefined, isDone: false, };
  }

  componentDidMount() {
    fetch('http://localhost:5000', {
      credentials: 'include',
    }).then(async res => {
      if (res.ok) {
        const result = await res.json();
        const crole = result.role;
        this.setState({ role: crole, isDone: true });
      } else {
        this.setState({ isDone: true });
      }
    }).catch(e => {
      throw new Error(e);
    })
  }

  updateRole = (role: string) => {
    this.setState({ role: role });
  }

  render() {
    if (this.state.isDone) {
      if (this.state.role && this.state.role === 'admin') {
        return (
          <Switch>
            <Route path="/" render={({ match, history }) => (
              <AdminHomePage match={match} history={history} />)} />
            <Route path='/testML' component={testML}></Route>
            <Route component={NotFound} exact={true}></Route>
          </Switch>
        );
      } else if (this.state.role && this.state.role !== 'admin') {
        return (
          <Switch>
            <Route path='/' component={UserHomePage}>
            </Route>
            <Route path='/testML' component={testML}></Route>
            <Route component={NotFound} exact={true}></Route>
          </Switch>
        );
      } else {
        return (
          <Switch>
            <Route path='/' exact component={Login}>
              <Login updateRole={this.updateRole}></Login>
            </Route>
            <Route path='/testML' component={testML}></Route>
            <Route component={NotFound} exact={true}></Route>
          </Switch>
        );
      }
    } else {
      return null;
    }
  }
}
export default App;

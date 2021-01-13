import React from 'react';
import logo from './logo.svg';
import './App.css';
import ReactDOM from 'react-dom';
import Login from './Login'
import testML from './TensorFlow/testML'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

function App() {
  return (
    <div className="App">
        <Route path='/login' component={Login}></Route>
        <Route path='/testML' component={testML}></Route>
    </div>
  );
}

export default App;

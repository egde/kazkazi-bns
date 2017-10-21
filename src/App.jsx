import React, {Component} from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom'

import 'bootstrap/dist/css/bootstrap-theme.css'
import './App.css'

import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'

class App extends Component {
  render() {
    return (
      <div>
        <Navbar/>
        <div className="container-fluid">
          <BrowserRouter>
            <Switch>
              <Route exact path="/" component={Home}/>
              <Route exact path="/about" component={About}/>
            </Switch>
          </BrowserRouter>
        </div>
        <Footer/>
      </div>
    );
  }
}

export default App;

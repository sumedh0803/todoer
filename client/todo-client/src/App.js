import './App.css';
import { AppBar, Toolbar, Typography, IconButton, Grid, Box, Button } from '@material-ui/core';
import Cookies from 'universal-cookie';
import { BrowserRouter as Router, Switch, Route, Link, Redirect} from "react-router-dom";
import React from 'react';
import Home from './components/Home'
import SignIn from './components/SignIn'
import SignUp from './components/SignUp';
import { AuthConsumer, AuthProvider } from './Utils/AuthContext';
class App extends React.Component {
  constructor()
  {
    super();
    this.state = {
      isSignedIn: false,
      loaded: false
    }
  }  
  render()
  {
    return (
        <div className="App">
          <AuthProvider>
            <AppBar position="static">
              <Toolbar>
                
                <Typography variant="h6" style={{ flex: 1 }}>To-Doer</Typography>
                <AuthConsumer>
                  {
                    (context) =>{
                      return  <Router>
                                <Link to = "/signin"><Button style = {{color: "white", textDecoration: "none"}} onClick = {()=>context.signout()}>{context.isSignedIn ? "Logout" : "Login"}</Button></Link>
                              </Router>
                    }
                  }
                </AuthConsumer>
                
              </Toolbar>
            </AppBar> 
            <Router>
              <Switch> 
                <Route path = "/" exact component = {Home}/>
                <Route path = "/signin" exact component = {SignIn}/>
                <Route path = "/signup" exact component = {SignUp}/>
              </Switch>
            </Router>
          </AuthProvider>
        </div>      
    );
  }
  
}

export default App;

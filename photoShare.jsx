import React from 'react';
import ReactDOM from 'react-dom';
import {
  HashRouter, Route, Switch
} from 'react-router-dom';
import {
  Grid, Typography, Paper
} from '@material-ui/core';
import './styles/main.css';

// import necessary components
import TopBar from './components/topBar/TopBar';
import UserDetail from './components/userDetail/UserDetail';
import UserList from './components/userList/UserList';
import UserPhotos from './components/userPhotos/UserPhotos';
import {LoginRegister, Register} from './components/loginRegister/LoginRegister';
import UserLogin from './components/userLogin/UserLogin';
import {Provider} from 'react-redux';
import store from './states/store.js';

class PhotoShare extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userIsLoggedIn: true
    };
  }

  renderLoggedIn(){

  }

  render() {
    return (
      <HashRouter>
      <div>
          <Switch>
            <Route exact path="/login-register"
              render={ props => <LoginRegister {...props} />}
            />
            <Route path="/login-register/register"
              render={ props => <Register {...props} />}
            />
            <Route path="/" exact
              render={ props => <UserLogin {...props} /> }
            />
          </Switch>
      </div>
    </HashRouter>
    );
  }
}


ReactDOM.render(
  <Provider store={store}>
  <PhotoShare />
  </Provider>,
  document.getElementById('photoshareapp'),
);

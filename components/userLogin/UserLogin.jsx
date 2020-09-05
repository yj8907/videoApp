import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import {
  HashRouter, Route, Switch, Redirect
} from 'react-router-dom';
import {
  Grid, Typography, Paper
} from '@material-ui/core';
import '../../styles/main.css';

import {useDispatch, useSelector} from 'react-redux';
import {setLoggedIn} from '../../states/features/userState';

// import necessary components
import TopBar from '../topBar/TopBar';
import UserDetail from '../userDetail/UserDetail';
import UserList from '../userList/UserList';
import UserPhotos from '../userPhotos/UserPhotos';
import LoginRegister from '../loginRegister/LoginRegister';

function UserLogin(props) {

  const [currDisplay, setCurrDisplay] = useState("Introduction");
  const userIsLoggedIn = useSelector(state => state.user.userIsLoggedIn);
  const viewerUserId = useSelector(state => state.user.userid);
  const viewerUserName = useSelector(state => state.user.username)
  console.log(viewerUserId);
  // userIsLoggedIn = false;

  function renderLoggedIn (){
  }

    return (
      <HashRouter>
      <div>
      <Grid container spacing={8}>
        <Grid item xs={12}>
          <TopBar currDisplay={currDisplay} viewerUserName={viewerUserName} viewerUserId={viewerUserId} />
        </Grid>
        <div className="cs142-main-topbar-buffer"/>
        <Grid item sm={3}>
          <Paper  className="cs142-main-grid-item">
            <UserList />
          </Paper>
        </Grid>
        <Grid item sm={9}>
          <Paper className="cs142-main-grid-item">
            <Switch>                      
            { userIsLoggedIn ? <Route exact path="/"
                render={() =>
                  <Typography variant="body1">
                  Welcome to your photosharing app! This <a href="https://material-ui.com/demos/paper/">Paper</a> component
                  displays the main content of the application. The {"sm={9}"} prop in
                  the <a href="https://material-ui.com/layout/grid/">Grid</a> item component makes it responsively
                  display 9/12 of the window. The Switch component enables us to conditionally render different
                  components to this part of the screen. You don&apos;t need to display anything here on the homepage,
                  so you should delete this Route component once you get started.
                  </Typography>}
              /> : <Redirect exact path="/" to="/login-register"/>
              }
              {userIsLoggedIn ? <Route path="/users/:userId"
                render={ props => <UserDetail {...props} callback={setCurrDisplay} viewerUserId={viewerUserId} />}/>
                : <Redirect exact path="/" to="/login-register"/>
              }
              {userIsLoggedIn ? <Route path="/photos/:userId"
                render ={ props => <UserPhotos {...props} callback={setCurrDisplay} viewerUserId={viewerUserId} /> }
                />
                : <Redirect exact path="/" to="/login-register"/>
              }
              <Route path="/users" component={UserList}  />
            </Switch>
          </Paper>
        </Grid>
      </Grid>
      </div>
    </HashRouter>
    );
}


export default UserLogin;

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
import VideoList from '../videoList/VideoList';

import { Map, GoogleApiWrapper } from 'google-maps-react';
import VideoMap from '../videoMap/VideoMap';

function UserLogin(props) {

  const [currDisplay, setCurrDisplay] = useState("Introduction");
  // const userIsLoggedIn = useSelector(state => state.user.userIsLoggedIn);
  const viewerUserId = useSelector(state => state.user.userid);
  const viewerUserName = useSelector(state => state.user.username)
  console.log(viewerUserId);
  const userIsLoggedIn = true;

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
        <Grid item sm={9} style={{position: 'relative'}}>
          <Paper className="cs142-main-grid-item">
            <Switch>
            { userIsLoggedIn ? <Route exact path="/"
                render= { props => <VideoMap {...props}  /> }
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
              <Route path="/videos/:topicId"
                render ={ props => <VideoList {...props}  /> } />
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

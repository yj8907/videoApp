import React, {useState} from 'react';
import {
  AppBar, Toolbar, Typography, Box, Grid, TextField, Button, InputLabel
} from '@material-ui/core';

import axios from 'axios';
import {useDispatch, useSelector} from 'react-redux';
import {setLoggedIn, setUserId, setUserName as setStateUserName} from '../../states/features/userState';

function LoginRegister(props) {

  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const [loginError, setloginError] = useState(false);

  const loginHelperText = "Username doesn't exists";
  var loginUrl = "admin/login"
  const dispatch = useDispatch();

  function loginHandler(){
    var requestBody = {
      login_name: username,
      password: password
    };
    setloginError(false);

    axios.post(loginUrl, requestBody).then(
      (res) => {
        console.log(res);
        if (res.data){
          dispatch(setLoggedIn(true));
          dispatch(setUserId(res.data._id));
          dispatch(setStateUserName(`${res.data.first_name}`));
          window.location.href = "#/";
          return;
        } else {
          setloginError(true);
          return;
        }
      }
    ).catch( (error) => {
      console.log(error);
    });

  }

  function makeLoginRegister(){
    var loginForm = (
      <div>
      <Grid container justify="center" direction="row">
      <Box mt="30vh">
        <form noValidate autoComplete="off">
          <Box ml={-2}>
          <Typography variant="h3">
          Welcome
          </Typography>
          </Box>
          <div>
            <TextField id="username" label="Username" value={username} error={loginError}
            helperText={loginError ? loginHelperText : ""}
            onChange={event=>setUserName(event.target.value)}/>
          </div>
          <div>
            <TextField id="password" label="Password" type="password" value={password}
            onChange={event=>setPassword(event.target.value)}/>
          </div>
        </form>
        <Box mt={1} mb={1}>
        <Button variant="contained" color="primary" onClick={loginHandler}>SIGN IN</Button>
        </Box>
        <Button href={window.location.href.concat("/register")}>New User</Button>
      </Box>
      </Grid>
      </div>
    );

    return loginForm;
  }

  return (<div>
      {makeLoginRegister()}
    </div>
  );
}


function Register(props){

  const [userName, setUserName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [occupation, setOccupation] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const [passwordError, setPasswordError] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const passwordHelperText = "Wrong password";
  const usernameHelperText = "Username already exists";

  const userUrl = "user";

  function submitForm(){

    if (password !== passwordConfirm){
      setPasswordError(true);
      setPassword("");
      setPasswordConfirm("");
      return
    }

    setPasswordError(false);
    setUsernameError(false);

    var requestBody = {
      login_name: userName,
      password: password,
      first_name: firstName,
      last_name: lastName,
      location: location,
      description: description,
      occupation: occupation
      };
    axios.post(userUrl, requestBody).then(
      (res) => {
        console.log(res);
        if (!res.data){
          setUsernameError(true);
        } else {
          var currHref = window.location.href;
          window.location.href = '#/login-register';
        }
      }
  )

  }

  function makeRegisterForm(){
    var registerForm = (
      <div>
      <Grid container justify="center" direction="row">
      <Box mt="20vh">
        <form noValidate autoComplete="off">
          <Box ml={-1} mb={1}>
          <Typography variant="h3">
          New User
          </Typography>
          </Box>
            <InputLabel>Username:</InputLabel>
            <TextField error={usernameError} id="username"
              helperText={usernameError ? usernameHelperText : ""}
              onChange={e => setUserName(e.target.value)}/>
            <InputLabel>First Name:</InputLabel>
            <TextField id="first_name" onChange={e=>setFirstName(e.target.value)}/>
            <InputLabel>Last Name:</InputLabel>
            <TextField id="last_name" onChange={e=>setLastName(e.target.value)}/>
            <InputLabel>Location:</InputLabel>
            <TextField id="location" onChange={e=>setLocation(e.target.value)}/>
            <InputLabel>Description:</InputLabel>
            <TextField id="description" onChange={e=>setDescription(e.target.value)}/>
            <InputLabel>Occupation:</InputLabel>
            <TextField id="occupation" onChange={e=>setOccupation(e.target.value)}/>

            <InputLabel>Password:</InputLabel>
            <TextField error={passwordError} value={password}
              helperText={passwordError ? passwordHelperText : ""}
              onChange={e => setPassword(e.target.value)} id="password" type="password"/>
            <InputLabel>Confirm Password:</InputLabel>
            <TextField error={passwordError} value={passwordConfirm}
              helperText={passwordError ? passwordHelperText : ""}
              onChange={e => setPasswordConfirm(e.target.value)} id="confirm_password" type="password"/>
        </form>
        <Box mt={1}>
        <Button variant="contained" color="primary" onClick={submitForm}>Register Me</Button>
        </Box>
      </Box>
      </Grid>
      </div>
    );

    return registerForm;
  }

  return (<div>
      {makeRegisterForm()}
    </div>
  );

}

function LogOut(props){

  const dispatch = useDispatch();
  function logoutHandler(){
    dispatch(setLoggedIn(false));
    dispatch(setUserId(""));
    dispatch(setStateUserName(""));
    window.location.href = "#/login-register";
    return;
  }

  return (
    <div>
    <Box mt={-6}>
    <Button variant="contained" color="secondary" onClick={logoutHandler}>
    Log Out
    </Button>
    </Box>
    </div>)
}

export {LoginRegister, Register, LogOut};

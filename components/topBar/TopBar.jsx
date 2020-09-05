import React from 'react';
import {
  AppBar, Toolbar, Typography, Box, Button
} from '@material-ui/core';
import './TopBar.css';

import {LogOut} from '../loginRegister/LoginRegister';
import axios from 'axios';

/**
 * Define TopBar, a React componment of CS142 project #5
 */
class TopBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      viewerUserName: "",
      viewerUserId: "",
      currDisplay:""
    }
  }

  componentDidMount(){
    this.setState({
      currDisplay: this.props.currDisplay,
      viewerUserName: this.props.viewerUserName,
      viewerUserId: this.props.viewerUserId
    });
  }

  componentDidUpdate(prevProps){
    console.log(this.props.currDisplay);
    if (this.state.currDisplay !== this.props.currDisplay){
      this.setState({
        currDisplay: this.props.currDisplay
      });
    }
  }

  //this function is called when user presses the update button
   handleUploadButtonClicked = (e) => {
      e.preventDefault();
      if (this.uploadInput.files.length > 0) {
       // Create a DOM form and add the file to it under the name uploadedphoto
       const domForm = new FormData();
       domForm.append('uploadedphoto', this.uploadInput.files[0]);
       domForm.append('user_id', this.state.viewerUserId);
       // domForm.append('date_time', new Date());
       axios.post('photos/new', domForm)
         .then((res) => {
           // console.log(res);
         })
         .catch(err => console.log(`POST ERR: ${err}`));
   }
 }

  render() {
    return (
      <AppBar className="cs142-topbar-appBar" position="absolute">
        <Toolbar>
          <Box xs={4}>
          <Typography variant="h4" color="inherit">
              {`Welcome, ${this.state.viewerUserName}`}
          </Typography>
          </Box>
          <Box xs={1} ml={"5vw"}>
            <label htmlFor="add-photo-button">
              <Button variant="contained" component="span">
              Add Photo
              </Button>
            </label>
            <input type="file" accept="image/*" id="add-photo-button" style={{ display: 'none' }}
                ref={(domFileRef) => { this.uploadInput = domFileRef; }} />
          </Box>
          <Box xs={1} ml={"1vw"}>
          <Button variant="contained" component="span" onClick={(e) => {this.handleUploadButtonClicked(e)}}>
          Submit
          </Button>
          </Box>
          <Box xs={3} ml={"25vw"}>
          <Typography variant="h5" color="inherit">
              {this.state.currDisplay}
          </Typography>
          </Box>
        </Toolbar>
        <Box xs={2} ml={"90vw"}>
        <LogOut />
        </Box>
      </AppBar>
    );
  }
}

export default TopBar;

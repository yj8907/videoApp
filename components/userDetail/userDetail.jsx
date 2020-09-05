import React from 'react';
import {
  Typography, Grid, Button
} from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { withStyles } from '@material-ui/core/styles';
import './userDetail.css';
import axios from 'axios';

/**
 * Define UserDetail, a React componment of CS142 project #5
 */


 const useStyles = theme => ({
  userInfo: {
    background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
    border: 0,
    borderRadius: 5,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    height: 84,
    padding: '0 30px',
  },
  button: {
    height: 84,
    padding: '60px 30px',
  },
});

class UserDetail extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userInfo: {
        _id: "placeholder",
        first_name: "placeholder",
        last_name: "placeholder",
        location: "placeholder",
        description: "placeholder"
      }
    }

    this.updateUserBound = this.updateUser.bind(this);
  }


  updateUser(response) {
    this.setState({
      userInfo: response.data
    });

    var topBarDisplay = "User: ".concat(this.state.userInfo.first_name.concat(" ").
        concat(this.state.userInfo.last_name));
    this.props.callback(topBarDisplay);

  };

  componentDidMount(){
    var backendUList = "user/".concat(this.props.match.params.userId);
    axios.get(backendUList).then(this.updateUserBound);
  }

  componentDidUpdate(prevProps){
    if (this.state.userInfo._id !== this.props.match.params.userId){
      var backendUList = "user/".concat(this.props.match.params.userId);
      axios.get(backendUList).then(this.updateUserBound);
    }
  }

  render() {

    var photoPath = "#/photos/"
    const { classes } = this.props;

    return (
      <div>
      <Grid container spacing={8}>

      <Grid item xs={12} sm={6}>
          <Box className={classes.userInfo} m={2}>
          <Typography fontSize={12}>
            Name: {this.state.userInfo.first_name.concat(" ").concat(this.state.userInfo.last_name)}<br/>
            Location: {this.state.userInfo.location}<br/>
            Description: {this.state.userInfo.description}<br/>
          </Typography>
          </Box>
      </Grid>

      <Grid item xs={6} sm={3}>
          <Button className={classes.button} color="primary" href={photoPath.concat(this.props.match.params.userId)}
            fullWidth={true} size="large">
            <Typography variant="h4">
              Photo
            </Typography>
          </Button>
      </Grid>

      </Grid>
      </div>
    );
  }
}

export default withStyles(useStyles)(UserDetail);

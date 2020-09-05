import React from 'react';
import {
  Typography, Avatar, Collapse, TextField
} from '@material-ui/core';
import './userPhotos.css';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CardHeader from '@material-ui/core/CardHeader';
import IconButton from "@material-ui/core/IconButton";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import clsx from "clsx";
import Box from '@material-ui/core/Box';

import { withStyles } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';
import axios from 'axios';

const useStyles = theme => ({
  root: {
    height: 0,
    maxWidth: 100
  },
  media: {
    height: 0,
    paddingTop: "56.25%" // 16:9
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: "rotate(180deg)"
  },
  avatar: {
    backgroundColor: red[500]
  }
});

/**
 * Define UserPhotos, a React componment of CS142 project #5
 */
class UserPhotos extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      expanded:[],
      photoInfo: [],
      userId: "",
      viewerUserId: "",
      userInfo: {},
      updateContent: false
    }
    this.handleExpandClickBound = this.handleExpandClick.bind(this);
    this.updatePhotoInfoBound = this.updatePhotoInfo.bind(this);
    this.updateUserBound = this.updateUser.bind(this);
    this.updateCommentsBound = this.updateComments.bind(this);
  }

  updateUser(response) {
    // console.log(response.data);
    this.setState({
      userInfo: response.data
    });

    var topBarDisplay = "Photos of ".concat(this.state.userInfo.first_name.concat(" ").
        concat(this.state.userInfo.last_name));
    this.props.callback(topBarDisplay);

  };


  updatePhotoInfo(response) {
    // console.log(response.data);
    this.setState({
      expanded: this.state.expanded,
      photoInfo: response.data,
      userId: this.props.match.params.userId,
      viewerUserId: this.props.viewerUserId
    });
  };

  componentDidMount(){
    var backendUList = "photosOfUser/".concat(this.props.match.params.userId);
    axios.get(backendUList).then(this.updatePhotoInfoBound);
    backendUList = "user/".concat(this.props.match.params.userId);
    axios.get(backendUList).then(this.updateUserBound);
  }

  componentDidUpdate(prevProps){
    if (this.state.userId !== this.props.match.params.userId || this.state.updateContent){
      var backendUList = "photosOfUser/".concat(this.props.match.params.userId);
      axios.get(backendUList).then(this.updatePhotoInfoBound);
      backendUList = "user/".concat(this.props.match.params.userId);
      axios.get(backendUList).then(this.updateUserBound);
      this.state.updateContent = false;
    }
  }

  handleExpandClick(i) {
    var prevExpanded = this.state.expanded;
    prevExpanded[i] = !prevExpanded[i];
    this.setState({expanded: prevExpanded})
  }

  updateComments(photoId, event){
    console.log(photoId);
    if (event.key==="Enter"){
      var currentTime = new Date();
      var new_comment = {
        comment: event.target.value,
        date_time: currentTime,
        user_id: this.state.viewerUserId
      };
      var backendUList = `commentsOfPhoto/${photoId}`;
      axios.post(backendUList, new_comment).then((res) => {
        if (!res.data){
          console.log("failed to add comments")
        } else {
          this.setState({updateContent: true});
        }
      });
    }
  }

  makeComments(photoComments){

    var comments = []
    if (typeof photoComments !== "undefined"){
      photoComments.forEach((item, i) => {
        comments[i] = (<CardContent>
          <Typography component="div" variant="body2">
          <Box fontWeight="fontWeightRegular" m={1}>
            {item.user.first_name.concat(" ").concat(item.user.last_name)}:
          </Box>
          </Typography>
          <Typography variant="body1">
           {item.comment}
          </Typography>
        </CardContent>
      )
      }
    );
    } else {
      comments[0] = (
        <CardContent>
        <Typography variant="h4">
          No comments
        </Typography>
      </CardContent>
    )
    }

    return comments;
  }

  makePhotos(photoInfo){

        var photos = []
        photoInfo.forEach( (item, i) => {

          if ((typeof this.state.expanded[i] === 'undefined')){
            this.state.expanded[i] = false;
          }

          var date = new Date(item.date_time);
          var imgPath = "./images/".concat(item.file_name);

          const { classes } = this.props;
          var userInfo = this.state.userInfo;

          photos[i] =
          (<Card classes={classes.root}>
            <CardHeader
              avatar={
                <Avatar aria-label="recipe" className={classes.avatar}>
                  {userInfo.first_name.charAt(0).concat(userInfo.last_name.charAt(0))}
                </Avatar>
              }
              title={"Photo Name: ".concat(item.file_name)}
              subheader={"Created: ".concat(item.date_time)}
            />
            <CardMedia
              sm={3}
              className={classes.media}
              image={imgPath}
              title={item.file_name}
            />
            <CardActions disableSpacing>
              <IconButton
                className={clsx(classes.expand, {
                  [classes.expandOpen]: this.state.expanded[i]
                })}
                onClick={() => this.handleExpandClickBound(i)}
                aria-expanded={this.state.expanded[i]}
                aria-label="show more"
              >
                <ExpandMoreIcon />
              </IconButton>
          </CardActions>
          <Collapse in={this.state.expanded[i]} timeout="auto" unmountOnExit>
          {this.makeComments(item.comments)}
          <CardContent>
          <TextField variant='filled' label="write a comment"
            onKeyPress={ (event) => this.updateCommentsBound(item._id, event) }
          />
          </CardContent>
          </Collapse>
          </Card>
          )
        }
      );

    return photos;
  }

  render() {
    return (
      <div>
      {this.makePhotos(this.state.photoInfo)}
      </div>
    );

  }
}

export default withStyles(useStyles)(UserPhotos);

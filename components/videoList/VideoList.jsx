import React, {useState} from 'react';
import {
  AppBar, Toolbar, Typography, Box, Grid, TextField, Button, InputLabel
} from '@material-ui/core';

import axios from 'axios';
import {useDispatch, useSelector} from 'react-redux';
import {setLoggedIn, setUserId, setUserName as setStateUserName} from '../../states/features/userState';
import ReactPlayer from "react-player";


function VideoList(props){

  var topic = window.videoAppModels.findTopicById(props.match.params.topicId);

  console.log(topic);
  function makeVideos() {
    var videos = [];

    topic[0].video.forEach((item, i) => {
      if (item !== 'undefined'){
        videos[i] = <ReactPlayer url={item} controls={true} style={{ marginTop: "2%"}}/>
      }
    });

    return videos;
  };

  return (<div>
    <Typography variant="h2">
    {topic[0].name}
    </Typography>
    {makeVideos()}
    </div>
  )
}

export default VideoList;

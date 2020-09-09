import React, {useState} from 'react';
import {
  AppBar, Toolbar, Typography, Box, Grid, TextField, Button, InputLabel
} from '@material-ui/core';

import axios from 'axios';
import {useDispatch, useSelector} from 'react-redux';
import {setLoggedIn, setUserId, setUserName as setStateUserName} from '../../states/features/userState';

import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';

const mapStyles = {
  width: '100%',
  height: '100%',
};

class VideoMap extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      initialTopicVideos: window.videoAppModels.initTopicVideoModel()
    }

  }


  onMarkerClick(id){
    window.location.href = '#/videos/'+id;
  }

  createMarkers(){
    var markers = [];

    this.state.initialTopicVideos.forEach((item, i) => {
      markers[i] = <Marker
       title={item.name}
       position={item.geocoding[0].geometry.location}
       onClick={ () => this.onMarkerClick(item._id)}
       />
    });

    return markers;
  }

  render() {
    return (<div>
      <Map
          google={this.props.google}
          zoom={11.00}
          style={mapStyles}
          initialCenter={{lat: 49.2402334, lng: -123.243554}}
      >
      {this.createMarkers()}
      </Map>
      </div>)
  }
}

//AIzaSyAy5DABaWxdZ0nVksLUwiaUcTutTemb-3I

export default GoogleApiWrapper({
  apiKey: "AIzaSyAy5DABaWxdZ0nVksLUwiaUcTutTemb-3I"
})(VideoMap);

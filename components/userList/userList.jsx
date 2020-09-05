import React from 'react';
import {
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
}
from '@material-ui/core';
import './userList.css';

import axios from 'axios';

/**
 * Define UserList, a React componment of CS142 project #5
 */
class UserList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
    };

    this.updateUserListBound = this.updateUserList.bind(this);
  }

  updateUserList(response) {
    this.setState({
      users: response.data
    });
  };

  componentDidMount(){
    var backendUList = "user/list"
    axios.get(backendUList).then(this.updateUserListBound);
  }

  MakeUserList(){

    var path = "#/users/"
    var counter = 0;

    var userListItems = this.state.users.map((u) => {
      counter +=1;
      var userPath = path.concat(u._id);
      var userName = u.first_name.concat(" ").concat(u.last_name);
      var element = (
          <div key={u._id.concat("div")}>
          <ListItem button component="a" href={userPath}>
          <ListItemText primary={userName} />
          </ListItem>
          <Divider />
          </div>);
    return element;
    });

    return userListItems;
  }

  render() {
    return (
      <div>
        <Typography variant="h4">
          Users
        </Typography>
        <List component="nav">
          {this.MakeUserList()}
        </List>
      </div>
    );
  }
}

export default UserList;

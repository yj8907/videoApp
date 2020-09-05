import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  userIsLoggedIn: false,
  username: "",
  userid: ""
}

const userState = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserName: (state, action) => {
      state.username = action.payload
    },
    setUserId: (state, action) => {
      state.userid = action.payload
    },
    setLoggedIn: (state, action) => {
      state.userIsLoggedIn = action.payload
    }
  }
});

export const {setUserName, setUserId, setLoggedIn} = userState.actions;
export default userState.reducer;

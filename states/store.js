import {configureStore} from '@reduxjs/toolkit'

import userReducer from './features/userState'

export default configureStore({
  reducer: {
    user: userReducer
  }
})

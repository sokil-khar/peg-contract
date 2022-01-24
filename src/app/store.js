import { configureStore } from '@reduxjs/toolkit'
import accountReducer from '../redux/accountReducer'

export default configureStore({
  reducer: {
      account: accountReducer,
  },
})
import { configureStore } from '@reduxjs/toolkit'
import messagesReducer from '../redux/slices/messagesSlice'

export const store = configureStore({
  reducer: {
    messages: messagesReducer
  }
})
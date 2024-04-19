import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../redux/counter/counterSlice';
import { userSlice } from './UserSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    user: userSlice.reducer,
  },
});

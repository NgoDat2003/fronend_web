import { configureStore } from '@reduxjs/toolkit';
import { userSlice } from './UserSlice';
import { orderSlice } from './OrderSlice';

export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    order: orderSlice.reducer,
  },
});

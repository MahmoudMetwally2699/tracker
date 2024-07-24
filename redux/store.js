import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import trackReducer from './tracker';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tracks: trackReducer,
  },
});

import { configureStore } from '@reduxjs/toolkit';
import authReducer from "../slices/authSlice";
import notificationReducer from "../slices/authSlice";
import rideReducer from "../slices/authSlice";



export const store = configureStore({
  reducer: {
    auth: authReducer,
    notification:notificationReducer,
    ride:rideReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;

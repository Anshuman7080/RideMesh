import { configureStore } from '@reduxjs/toolkit';
import authReducer from "../slices/authSlice";
import notificationReducer from "../slices/notificationSlice";
import rideReducer from "../slices/rideSlice";
import riderReducer from "../slices/riderSlice";
import driverReducer from "../slices/driverSlice";
import locationReducer from "../slices/locationSlice"


export const store = configureStore({
  reducer: {
    auth: authReducer,
    notification:notificationReducer,
    ride:rideReducer,
    rider:riderReducer,
    driver:driverReducer,
    location:locationReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;

import { configureStore } from '@reduxjs/toolkit';
import authReducer from "../slices/authSlice";
import notificationReducer from "../slices/authSlice";
import rideReducer from "../slices/authSlice";
import riderReducer from "../slices/riderSlice";
import driverReducer from "../slices/driverSlice";


export const store = configureStore({
  reducer: {
    auth: authReducer,
    notification:notificationReducer,
    ride:rideReducer,
    rider:riderReducer,
    driver:driverReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;

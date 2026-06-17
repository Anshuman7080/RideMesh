import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentLocation: null, 
  isOnline: false,
  loading: false,
  error: null,
};

const locationSlice = createSlice({
  name: "location",
  initialState,

  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
    },

    setCurrentLocation: (state, action) => {
      state.currentLocation = action.payload;
    },

    setOnlineStatus: (state, action) => {
      state.isOnline = action.payload;
    },

    clearLocationState: (state) => {
      state.currentLocation = null;
      state.isOnline = false;
      state.error = null;
      state.loading = false;
    },
  },
});

export const {
  setLoading,
  setError,
  setCurrentLocation,
  setOnlineStatus,
  clearLocationState,
} = locationSlice.actions;

export default locationSlice.reducer;
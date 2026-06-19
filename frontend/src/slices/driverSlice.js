import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  profile: null,
  loading: false,
  error: null,
  applied: false,
  isApproved: false,
  rideList:[]
};

const driverSlice = createSlice({
  name: "driver",
  initialState,

  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
    },

    setProfile: (state, action) => {
      state.profile = action.payload;
    },
    setRideList:(state,action)=>{
      state.rideList=action.payload
    },

    setApplied: (state, action) => {
      state.applied = action.payload;
    },

    setIsApproved: (state, action) => {
      state.isApproved = action.payload;
    },

    updateAvailability: (state, action) => {
      if (state.profile) {
        state.profile.isAvailable = action.payload;
      }
    },

    clearDriverState: (state) => {
      state.profile = null;
      state.loading = false;
      state.error = null;
      state.applied = false;
      state.isApproved = false;
    },

    clearDriverError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setError,
  setProfile,
  setApplied,
  setIsApproved,
  updateAvailability,
  clearDriverState,
  clearDriverError,
  setRideList
} = driverSlice.actions;

export default driverSlice.reducer;
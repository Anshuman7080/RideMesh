import { createSlice } from "@reduxjs/toolkit";

const savedHistory = localStorage.getItem("rideHistory")
  ? JSON.parse(localStorage.getItem("rideHistory"))
  : [];

const initialState = {
  pickup: null,
  dropoff: null,
  distanceKm: 0,
  estimatedFare: 0,
  selectedVehicleType: "car",
  currentRide: null,
  rideHistory: savedHistory,
  nearbyDrivers: [],
  driverRequests: [],
  loading: false,
  error: null,
  bookingStatus: "idle",
};

const rideSlice = createSlice({
  name: "ride",
  initialState,
  reducers: {
    setPickup: (state, action) => {
      state.pickup = action.payload;
    },

    setDropoff: (state, action) => {
      state.dropoff = action.payload;
    },

    setDistanceAndFare: (state, action) => {
      const distance = Number(action.payload);
      state.distanceKm = distance;
      state.estimatedFare = Math.round(50 + distance * 12);
    },

    setSelectedVehicleType: (state, action) => {
      state.selectedVehicleType = action.payload;
    },

    setBookingStatus: (state, action) => {
      state.bookingStatus = action.payload;
    },

    resetBookingState: (state) => {
      state.pickup = null;
      state.dropoff = null;
      state.distanceKm = 0;
      state.estimatedFare = 0;
      state.currentRide = null;
      state.bookingStatus = "idle";
      state.error = null;
    },

    clearRideError: (state) => {
      state.error = null;
    },

    updateCurrentRideStatus: (state, action) => {
      if (
        state.currentRide &&
        state.currentRide._id === action.payload.rideId
      ) {
        state.currentRide.status = action.payload.status;

        if (action.payload.driverId) {
          state.currentRide.driverId = action.payload.driverId;
        }
      }
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
    },

    setCurrentRide: (state, action) => {
      state.currentRide = action.payload;
    },

    setRideHistory: (state, action) => {
      state.rideHistory = action.payload;
      localStorage.setItem("rideHistory", JSON.stringify(action.payload));
    },

    setNearbyDrivers: (state, action) => {
      state.nearbyDrivers = action.payload;
    },

    setDriverRequests: (state, action) => {
      state.driverRequests = action.payload;
    },
  },
});

export const {
  setPickup,
  setDropoff,
  setDistanceAndFare,
  setSelectedVehicleType,
  setBookingStatus,
  resetBookingState,
  clearRideError,
  updateCurrentRideStatus,
  setLoading,
  setError,
  setCurrentRide,
  setRideHistory,
  setNearbyDrivers,
  setDriverRequests,
} = rideSlice.actions;

export default rideSlice.reducer;
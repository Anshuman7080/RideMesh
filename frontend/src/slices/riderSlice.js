import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  profile: null,
  loading: false,
  error: null,
};

const riderSlice = createSlice({
  name: "rider",
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

    clearRiderState: (state) => {
      state.profile = null;
      state.loading = false;
      state.error = null;
    },

    clearRiderError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setError,
  setProfile,
  clearRiderState,
  clearRiderError,
} = riderSlice.actions;

export default riderSlice.reducer;
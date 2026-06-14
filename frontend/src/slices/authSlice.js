import { createSlice } from "@reduxjs/toolkit";

const token = localStorage.getItem("token") || null;
const role = localStorage.getItem("role") || "rider";

let user = null;

try {
  user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;
} catch (e) {
  console.error("Failed to parse user from localStorage:", e);
}

const initialState = {
  user,
  token,
  role,
  loading: false,
  error: null,
  otpSentEmail: null,
  otpSent: false,
  signUpSuccess: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
    },

    setOtpSent: (state, action) => {
      state.otpSent = action.payload;
    },

    setOtpSentEmail: (state, action) => {
      state.otpSentEmail = action.payload;
    },

    setSignUpSuccess: (state, action) => {
      state.signUpSuccess = action.payload;
    },

    setUser: (state, action) => {
      state.user = action.payload;
    },

    setToken: (state, action) => {
      state.token = action.payload;
    },

    setRole: (state, action) => {
      state.role = action.payload;
      localStorage.setItem("role", action.payload);
    },

    updateUserProfile: (state, action) => {
      if (state.user) {
        state.user = {
          ...state.user,
          ...action.payload,
        };

        localStorage.setItem(
          "user",
          JSON.stringify(state.user)
        );
      }
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.role = "rider";
      state.loading = false;
      state.error = null;
      state.otpSent = false;
      state.otpSentEmail = null;
      state.signUpSuccess = false;

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("role");
    },

    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setError,
  setOtpSent,
  setOtpSentEmail,
  setSignUpSuccess,
  setUser,
  setToken,
  setRole,
  updateUserProfile,
  logout,
  clearError,
} = authSlice.actions;

export default authSlice.reducer;
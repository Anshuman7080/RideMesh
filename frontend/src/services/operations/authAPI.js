
import {
  setLoading,
  setError,
  setOtpSent,
  setOtpSentEmail,
  setSignUpSuccess,
  setUser,
  setToken,
  setRole,
  logout,
} from "../../slices/authSlice";

import {apiConnector } from "../apiconnector"

export const sentOtp = ({ name, email, password }) => 
  async (dispatch) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const res = await apiConnector .post("/auth/send-otp", {
        name,
        email,
        password,
      });

      dispatch(setOtpSent(true));
      dispatch(setOtpSentEmail(email));
    } catch (error) {
      dispatch(
        setError(error.response?.data?.message || "Failed to send OTP")
      );
      dispatch(setOtpSent(false));
    } finally {
      dispatch(setLoading(false));
    }
  };


export const verifyOtp =({ email, otp }) =>

  async (dispatch) => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    dispatch(setSignUpSuccess(false));

    try {
      const response = await apiConnector .post(
        "/auth/verify-otp",
        {
          email,
          otp,
        }
      );

      const data = response.data;

      const userObj = data.user;

      const userToken =
        data.token ||
        data.accessToken ||
        "mock_token_" + Date.now();

      dispatch(setUser(userObj));
      dispatch(setToken(userToken));
      dispatch(setRole(userObj.role || "rider"));

      dispatch(setSignUpSuccess(true));
      dispatch(setOtpSent(false));
      dispatch(setOtpSentEmail(null));

      localStorage.setItem("token", userToken);
      localStorage.setItem(
        "user",
        JSON.stringify(userObj)
      );
      localStorage.setItem(
        "role",
        userObj.role || "rider"
      );
    } catch (error) {
      dispatch(
        setError(
          error.response?.data?.message ||
            "Incorrect or expired OTP"
        )
      );
    } finally {
      dispatch(setLoading(false));
    }
  };


export const resendOtp = ({ email }) =>
  async (dispatch) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      await apiConnector .post("/auth/resend-otp", {
        email,
      });
    } catch (error) {
      dispatch(
        setError(
          error.response?.data?.message ||
            "Failed to resend OTP"
        )
      );
    } finally {
      dispatch(setLoading(false));
    }
};

export const login =({ email, password }) =>
  async (dispatch) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const response = await apiConnector .post(
        "/auth/login",
        {
          email,
          password,
        }
      );

      const data = response.data;

      const userObj = data.user;

      const userToken =
        data.token ||
        data.accessToken ||
        "dev_token_placeholder";

      dispatch(setUser(userObj));
      dispatch(setToken(userToken));
      dispatch(setRole(userObj.role || "rider"));

      localStorage.setItem(
        "token",
        userToken
      );

      localStorage.setItem(
        "user",
        JSON.stringify(userObj)
      );

      localStorage.setItem(
        "role",
        userObj.role || "rider"
      );
    } catch (error) {
      dispatch(
        setError(
          error.response?.data?.message ||
            "Invalid email or password"
        )
      );
    } finally {
      dispatch(setLoading(false));
    }
};

export const logoutUser = () => (dispatch) => {
  dispatch(logout());
};
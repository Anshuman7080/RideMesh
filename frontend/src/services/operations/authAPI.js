
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

import { authEndPoints } from "../apis";

const { SEND_OTP, VERIFY_OTP, RESEND_OTP, LOGIN,LOGOUT } = authEndPoints;


console.log("sendOPt",SEND_OTP);

export const sentOtp = ({ name, email, password }) => 
  async (dispatch) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const res = await apiConnector("POST",SEND_OTP,{
        name,email,password
      })

      //  console.log("SENDOTP API RESPONSE............", res)

      dispatch(setOtpSent(true));
      dispatch(setOtpSentEmail(email));
    } catch (error) {

      console.log("error is ",error);
      dispatch(
        setError(error.response?.data?.message || "Failed to send OTP")
      );
      dispatch(setOtpSent(false));
    } finally {
      dispatch(setLoading(false));
    }
  };


export const verifyOtp =({ email, otpCode }) =>

  async (dispatch) => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    dispatch(setSignUpSuccess(false));
    console.log("email,otp",email,otpCode);

    try {
      const response = await apiConnector("POST",VERIFY_OTP,
        {
          email,
          otp:otpCode,
        }
      );

      // console.log("Response of verify opt",response);

    const userObj=response?.data?.user

      dispatch(setUser(userObj));
      dispatch(setRole(userObj.role || "rider"));

      dispatch(setSignUpSuccess(true));
      dispatch(setOtpSent(false));
      dispatch(setOtpSentEmail(null));

      localStorage.setItem(
        "user",
        JSON.stringify(userObj)
      );
      localStorage.setItem(
        "role",
        userObj.role || "rider"
      );
    } catch (error) {
      console.log("error in verifying opt",error);
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
    console.log("email in resendotp",email);

    try {
    const res=  await apiConnector("POST",RESEND_OTP,{
        email,
      });

      // console.log("response of resending otp",res);


    } catch (error) {

      console.log("Error in ressending otp",error);
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
      const response = await apiConnector("POST",LOGIN,
        {
          email,
          password,
        }
      );

      // console.log("response of user login",response);

      const data = response.data;

      const userObj = data.user;

      const userToken =
        userObj.token ||
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

export const logoutUser =() =>
  async (dispatch) => {
    try {
      const response = await apiConnector("POST",LOGOUT);
      dispatch(logout());
    } catch (error) {
      console.log("Failed to logout",error);
      
    } 
};





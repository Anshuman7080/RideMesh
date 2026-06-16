import {apiConnector} from "../apiconnector"

import {
  setLoading,
  setError,
  setProfile,
} from "../../slices/riderSlice";

import { updateUserProfile } from "../../slices/authSlice";


export const getRiderProfile = () => async (dispatch) => {
  dispatch(setLoading(true));
  dispatch(setError(null));

  try {
    const response = await apiConnector("/riders/profile");

    dispatch(setProfile(response.data.rider));
  } catch (error) {
   
  } finally {
    dispatch(setLoading(false));
  }
};



export const updateRiderDetails =
  () =>
  async (dispatch) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const response = await apiConnector("/riders/profile", {
        name,
        phone,
        profilePhoto,
      });

     

    } catch (error) {
     
    } finally {
      dispatch(setLoading(false));
    }
  };


export const deactivateRider = () => async (dispatch) => {
  dispatch(setLoading(true));
  dispatch(setError(null));

  try {
    await apiConnector("/riders/profile");

    dispatch(setProfile(null));
  } catch (error) {
   
  } finally {
    dispatch(setLoading(false));
  }
};
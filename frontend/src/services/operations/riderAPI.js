import {apiConnector} from "../apiconnector"

import {
  setLoading,
  setError,
  setProfile,
} from "../../slices/riderSlice";

import { updateUserProfile } from "../../slices/authSlice";
import { riderEndPoints } from "../apis";
const {GETRIDERDETAILFORRIDE}=riderEndPoints

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


export const  getRiderDetailForRide=({riderId,token})=>
    async(dispatch)=>{
      try{
        const response=await apiConnector('GET',GETRIDERDETAILFORRIDE(riderId),{},{
        
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        
        })

        console.log("response for getRiderDetailForRide",response);

        return response?.data?.riderDetail;

      }
      catch(error){
        console.log("Error in gettingRiderDetailForRide...",error);
        dispatch(
                setError(
                  error.response?.data?.message ||
                    "Failed to get rider  detail"
                )
              );
        return null;
      }
    }
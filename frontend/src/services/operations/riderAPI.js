import {apiConnector} from "../apiconnector"

import {
  setLoading,
  setError,
  setProfile,
} from "../../slices/riderSlice";

import { updateUserProfile } from "../../slices/authSlice";
import { riderEndPoints } from "../apis";
import { logoutUser } from "./authAPI";
const {GETRIDERDETAILFORRIDE,GET_RIDER_PROFILE,UPDATE_RIDER_PROFILE,DELETE_RIDER_PROFILE}=riderEndPoints

export const getRiderProfile = ({token}) => async (dispatch) => {
  dispatch(setLoading(true));
  dispatch(setError(null));

  try {
     const response=await apiConnector("GET",GET_RIDER_PROFILE,{},{
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
     })   

    //  console.log("response of getRiderProfile is",response);

     dispatch(setProfile(response?.data?.details))

  } catch (error) {

    console.log("Error in getting rider profile",error);
    console.log("Error in getting rider profile",error.response?.data)

    dispatch(
            setError(
              error.response?.data?.message ||
                "Failed to get Rider profile."
            )
          );
   
  } finally {
    dispatch(setLoading(false));
  }
};



export const updateRiderDetails =({name,phone,token}) =>async (dispatch) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const response = await apiConnector("PUT",UPDATE_RIDER_PROFILE, {
        name,
        phone,
        
      },{
        Authorization: `Bearer ${token}`,
       "Content-Type": "application/json",
      });

    //  console.log("response of updating rider profile",response);

     dispatch(setProfile(response?.data?.details))


    } catch (error) {
     
      console.log("Error in updating rider profile",error);
      console.log("Error in updating ride profile",error?.response?.data);
       dispatch(
            setError(
              error.response?.data?.message ||
                "Failed to update details"
            )
          );
    } finally {
      dispatch(setLoading(false));
    }
  };


export const deactivateRider = ({token}) => async (dispatch) => {
  dispatch(setLoading(true));
  dispatch(setError(null));

  try {
  const response=  await apiConnector("DELETE",DELETE_RIDER_PROFILE,{},{
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    });

    // console.log("response of deleting rider account",response);
   
    dispatch(setProfile(null));
    dispatch(logoutUser());
  } catch (error) {
    console.log("Error in deleting rider account",error);
    console.log("Error in deleting rider account",error?.response?.data);
    dispatch(
            setError(
              error.response?.data?.message ||
                "Failed to delete rider accunt"
            )
          );
    
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

        // console.log("response for getRiderDetailForRide",response);

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
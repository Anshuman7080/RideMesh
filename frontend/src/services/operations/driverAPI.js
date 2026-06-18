import { apiConnector } from "../apiconnector";

import {
  setLoading,
  setError,
  setProfile,
  setApplied,
  setIsApproved,
  updateAvailability,
} from "../../slices/driverSlice";

import { driverEndPoints  } from "../apis";

const {GET_DRIVER_PROFILE,GETDRIVERDETAILFORRIDE}=driverEndPoints;


export const applyDriver =
  ({
    phone,
    vehicleType,
    vehicleNumber,
    drivingLicense,
  }) =>
  async (dispatch) => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    dispatch(setApplied(false));

    try {
      const response = await apiConnector("/drivers/apply", {
       
      });

      const driver = response.data.driver;

     
      dispatch(setIsApproved(driver?.isApproved || false));
    } catch (error) {
      
    } finally {
      
    }
  };



export const getDriverProfile = () => async (dispatch) => {
 
   dispatch(setLoading(true));
   dispatch(setError(null));
  try {
    const response = await apiConnector("GET",GET_DRIVER_PROFILE,{},{

    });

    console.log("response of getDriverProfile....",response);

    const driver = response.data.driver;

    console.log("driver is",driver);

    return driver;
  
  } catch (error) {
  console.log("error in getting  driverProfile",error);
  dispatch(setProfile(null));
  dispatch(setIsApproved(false));

  } finally {
   dispatch(setLoading(false));
  }
};


export const updateDriverProfile =
  (profileData) => async (dispatch) => {
   
    try {
      const response = await apiConnector(
        "/drivers/profile",
        profileData
      );

     
    } catch (error) {
      
    } finally {
    
    }
  };



export const toggleAvailability =
  (isAvailable) => async (dispatch) => {
   

    try {
      const response = await apiConnector(
        "/drivers/availability",
        {
          isAvailable,
        }
      );

      
    } catch (error) {
      
    } finally {
      
    }
  };


export const  getDriverDetailForRide=({driverId,token})=>
    async(dispatch)=>{
      try{
        const response=await apiConnector('GET',GETDRIVERDETAILFORRIDE(driverId),{},{
        
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        
        })

        console.log("response for getDriverDetailForRide",response);

        return response?.data?.driverDetail;

      }
      catch(error){
        console.log("Error in gettingDriverDetailForRide...",error);
        return null;
      }
    }


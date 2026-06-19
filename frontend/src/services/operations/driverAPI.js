import { apiConnector } from "../apiconnector";

import {
  setLoading,
  setError,
  setProfile,
  setApplied,
  setIsApproved,
  updateAvailability,
  setRideList
} from "../../slices/driverSlice";

import { driverEndPoints  } from "../apis";

const {GET_DRIVER_PROFILE,GETDRIVERDETAILFORRIDE,UPDATE_DRIVER_PROFILE,RIDE_RECORD_FOR_DRIVER}=driverEndPoints;


export const applyDriver = ({
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



export const getDriverProfile = ({token}) => async (dispatch) => {
 
   dispatch(setLoading(true));
   dispatch(setError(null));
  try {
    const response = await apiConnector("GET",GET_DRIVER_PROFILE,{},
      {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    );

    console.log("response of getDriverProfile....",response);

    const driver = response.data.driver;

    console.log("driver is",driver);

    dispatch(setProfile(driver));
  
  } catch (error) {
  console.log("error in getting  driverProfile",error);
  console.log("Error in getting driver details", error.response?.data?.message)
  dispatch(setProfile(null));
  dispatch(setIsApproved(false));

  } finally {
   dispatch(setLoading(false));
  }
};


export const updateDriverProfile =({profileData,token}) => async (dispatch) => {
   
    try {
      const response = await apiConnector("PUT",UPDATE_DRIVER_PROFILE,{
        profileData
      },{
         Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
      );

      console.log("response of updating driver profile",response);
        dispatch(setProfile(response?.data?.driver))
     
    } catch (error) {

      console.log("Error in updating driver profile",error);
      console.log("Error in updating driver profile",error.response?.data);
      
    } finally {
    
    }
  };


export const toggleAvailability =(isAvailable) => async (dispatch) => {
   

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

export const getRideListForDriver=({token})=>
  async (dispatch)=>{
    try{
     const response=await apiConnector('GET',RIDE_RECORD_FOR_DRIVER,{},{
      Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        
     })

     console.log("response of getRideList....",response);
     dispatch(setRideList(response?.data?.rideList))
    }
    catch(error){
      console.log("error in getting ride Lists",error.response?.data);
      console.log("Error in getting ride list",error);
    }
  }
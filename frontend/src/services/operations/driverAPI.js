import { apiConnector } from "../apiconnector";

import {
  setLoading,
  setError,
  setProfile,
  setApplied,
  setIsApproved,
  updateAvailability,
} from "../../slices/driverSlice";


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
 

  try {
    const response = await apiConnector("/drivers/profile");

    const driver = response.data.driver;


  } catch (error) {


  } finally {
   
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
import {
  setLoading,
  setError,
  setCurrentRide,
  setRideHistory,
  setNearbyDrivers,
  setDriverRequests,
  setBookingStatus,
} from "../../slices/rideSlice";
import {apiConnector } from "../apiconnector"
import { useNavigate } from "react-router-dom";

import {rideEndPoints} from "../apis";
import { driverEndPoints } from "../apis";
const {CREATE_RIDE,GET_DRIVER_REQUESTS,ACCEPT_RIDE,
  GET_RIDE_DETAILS,
  CANCEL_RIDE,RATE_DRIVER,RATE_RIDER,REJECT_RIDE
  ,DRIVER_ARRIVED,START_RIDE,COMPLETE_RIDE,DRIVER_CANCEL,ACTIVE_RIDE
}=rideEndPoints

const {GETDRIVERDETAILFORRIDE} ={driverEndPoints};

export const createRide =({ pickup, dropoff, distanceKm,token}) =>
  async (dispatch) => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    dispatch(setBookingStatus("searching"));

    try {
      const response = await apiConnector(
        "POST",
        CREATE_RIDE,
        {
          pickup,
          dropoff,
          distanceKm,
        },
        {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      );

      console.log("response of creating ride",response);
      const ride = response?.data?.ride;
      

      dispatch(setCurrentRide(ride));

      // update history
      const saved =
        JSON.parse(localStorage.getItem("rideHistory")) || [];

      const exists = saved.find((r) => r._id === ride._id);

      let updatedHistory;

      if (!exists) {
        updatedHistory = [ride, ...saved];
      } else {
        updatedHistory = saved;
      }

      dispatch(setRideHistory(updatedHistory));
    } catch (error) {
      console.log("error in creating ride",error);
      console.log(error.response?.data);
      dispatch(
        setError(
          error.response?.data?.message ||
            "No drivers available nearby."
        )
      );
      dispatch(setBookingStatus("ride-options"));
    } finally {
      dispatch(setLoading(false));
    }
  };

export const getDriverRequests = (token) => {
  return async (dispatch) => {
    dispatch(setLoading(true));

    try {
      const response = await apiConnector(
        "GET",
        GET_DRIVER_REQUESTS,
        {},
        {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      );

      console.log("response of getDriverRequests....", response.data.requests);

     
      const formattedRequests = (response.data.requests || []).map((req) => ({
        rideId: req.rideId._id, 
        details: {
          _id: req.rideId._id,
          pickup: { address: req.rideId.pickup?.address },
          dropoff: { address: req.rideId.dropoff?.address },
          estimatedFare: req.rideId.estimatedFare,
          distanceKm: req.rideId.distanceKm,
        },
      }));

      dispatch(setDriverRequests(formattedRequests));
    } catch (error) {
      console.log("error in getting driver requests", error);
      dispatch(
        setError(
          error.response?.data?.message || "Error in getting driver requests"
        )
      );
    } finally {
      dispatch(setLoading(false));
    }
  };
};


export const acceptRide =(rideId,token,navigate) => async (dispatch) => {
    dispatch(setLoading(true));

    try {
      const response = await apiConnector(
       "PATCH",
       ACCEPT_RIDE(rideId),
       {},
       {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",}
      );
       
      console.log("response of accept ride",response);

      dispatch(setCurrentRide(response.data.ride));

      const current =
        JSON.parse(localStorage.getItem("driverRequests")) ||
        [];

      const filtered = current.filter(
        (r) => r.rideId !== rideId
      );

      dispatch(setDriverRequests(filtered));

      navigate(`/driver/active/${rideId}`);

    } catch (error) {
      
      if (error.response?.status === 400) {
    console.log(error.response.data.message); 
  } else {
    console.log("Something went wrong");
  }
      dispatch(
        setError(
          error.response?.data?.message ||
            "Failed to accept ride"
        )
      );
    } finally {
      dispatch(setLoading(false));
    }
  };


export const cancelRide =({ rideId, reason ,token,navigate}) =>
  async (dispatch) => {
    try {
    const response =  await apiConnector('PATCH',CANCEL_RIDE(rideId), { reason },{
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
    });

    console.log("Response of cancelling ride",response);

      dispatch(setBookingStatus("cancelled"));

      const history =
        JSON.parse(localStorage.getItem("rideHistory")) || [];

      const updated = history.map((r) =>
        r._id === rideId
          ? { ...r, status: "CANCELLED" }
          : r
      );

      dispatch(setRideHistory(updated));
       navigate('/rider/home');
    } catch (error) {
      console.log("Error in cancelling ride",error);
      console.log("Error in cancelling ride",error.response?.data);
      dispatch(
        setError(
          error.response?.data?.message ||
            "Failed to cancel ride"
        )
      );
    }
  };



export const rateDriver =({ rideId, rating ,token}) =>
  async (dispatch) => {
    try {
      console.log("rideId in thunk",rideId);
   const response=   await apiConnector("POST", RATE_DRIVER(rideId),{
        rating,
      },
        {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
      );

      console.log("response of rating driver",response);
      const history =JSON.parse(localStorage.getItem("rideHistory")) || [];

      const updated = history.map((r) =>
        r._id === rideId
          ? { ...r, riderRating: rating }
          : r
      );

      dispatch(setRideHistory(updated));
    } catch (error) {

      console.log("error in rating driver",error);
      dispatch(
        setError(
          error.response?.data?.message ||
            "Failed to submit rating"
        )
      );
    }
  };


// export const getNearbyDrivers =
//   ({ latitude, longitude }) =>
//   async (dispatch) => {
//     try {
//       const response = await apiConnector(
//         "/rides/drivers/nearby",
//         {
//           params: { latitude, longitude },
//         }
//       );

//       const rawDrivers = response.data.drivers || [];

//       const drivers = rawDrivers.map((d) => ({
//         driverId: Array.isArray(d) ? d[0] : d,
//         distanceKm: Array.isArray(d) ? Number(d[1]) : 0,
//       }));

//       dispatch(setNearbyDrivers(drivers));
//     } catch (error) {
//       dispatch(
//         setError(
//           error.response?.data?.message ||
//             "Failed to fetch nearby drivers"
//         )
//       );
//     }
//   };



export const rejectRide =({rideId,token}) => async (dispatch) => {
    try {
    const response=  await apiConnector(`PATCH`,REJECT_RIDE(rideId),{},{
      
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      
      });

      console.log("response of rejecting ride.....",response);

      const current =JSON.parse(localStorage.getItem("driverRequests")) || [];

      const filtered = current.filter(
        (r) => r.rideId !== rideId
      );

      dispatch(setDriverRequests(filtered));
    } catch (error) {
      console.log("Error in rejecting ride",error);
      dispatch(
        setError(
          error.response?.data?.message ||
            "Failed to reject ride"
        )
      );
    }
  };



export const driverArrived =({rideId,token}) => async (dispatch) => {
    try {
      const response = await apiConnector("PATCH",DRIVER_ARRIVED(rideId),{},
                 {
                   Authorization: `Bearer ${token}`,
                      "Content-Type": "application/json"
                 }
             );

      console.log("reponse of driverArrived",response);

      dispatch(setCurrentRide(response.data.ride));

    } catch (error) {
      console.log("Error in marking driver arrived",error);

      dispatch(
        setError(
          error.response?.data?.message ||
            "Failed to update status"
        )
      );
    }
  };

export const startRide =({rideId,token}) => async (dispatch) => {
    try {
      const response = await apiConnector("PATCH",START_RIDE(rideId),{},
        {
           Authorization: `Bearer ${token}`,
           "Content-Type": "application/json"
        }
      );

      console.log("response of startRide",response);

      dispatch(setCurrentRide(response.data.ride));
    } catch (error) {

      console.log("error in starting ride",error);
      dispatch(
        setError(
          error.response?.data?.message ||
            "Failed to start ride"
        )
      );
    }
  };



export const completeRide = ({rideId,token,navigate}) => async (dispatch) => {
    try {
      const response = await apiConnector("PATCH",COMPLETE_RIDE(rideId),{},{
         Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
      } 
      );

       console.log("response of completeRide",response);

      const ride = response.data.ride;

      dispatch(setCurrentRide(ride));

      // const history =
      //   JSON.parse(localStorage.getItem("rideHistory")) || [];

      // const exists = history.find((r) => r._id === ride._id);

      // let updated;

      // if (!exists) {
      //   updated = [ride, ...history];
      // } else {
      //   updated = history.map((r) =>
      //     r._id === ride._id ? ride : r
      //   );
      // }

      // dispatch(setRideHistory(updated));
      console.log("ride id in complted",ride?._id);
      navigate(`/driver/completed/${ride?._id}`);
    } catch (error) {
      console.log("Error in completing ride",error.response?.data);
      
      dispatch(
        setError(
          error.response?.data?.message ||
            "Failed to complete ride"
        )
      );
    }
  };



export const driverCancelRide = ({ rideId, reason,token,navigate }) =>
  async (dispatch) => {
    try {
    const res=  await apiConnector("PATCH",DRIVER_CANCEL(rideId),{reason}, {
           Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
      });
     
      console.log("res of driver cancelling ride",res);

      const history = JSON.parse(localStorage.getItem("rideHistory")) || [];

      const updated = history.map((r) =>
        r._id === rideId
          ? { ...r, status: "CANCELLED" }
          : r
      );

      dispatch(setRideHistory(updated));
      navigate('/driver/home')
    } catch (error) {
      console.log("Errr in cancelling ride by driver",error.response?.data?.message);
      dispatch(
        setError(
          error.response?.data?.message ||
            "Failed to cancel ride"
        )
      );
    }
  };


export const rateRider =({ rideId, rating,token }) =>async (dispatch) => {
    try {
     const response= await apiConnector("POST",RATE_RIDER(rideId), {
        rating  
      },{
         Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
      });

      console.log("res of rating rider",response);
      // const history =JSON.parse(localStorage.getItem("rideHistory")) || [];

      // const updated = history.map((r) =>
      //   r._id === rideId
      //     ? { ...r, driverRating: rating }
      //     : r
      // );

      dispatch(setRideHistory(updated));
    } catch (error) {

      console.log("Error in rating rider",error.response?.data?.message);
      dispatch(
        setError(
          error.response?.data?.message ||
            "Failed to submit rider rating"
        )
      );
    }
  };

export const getRideDetails=({rideId,token})=>async(dispatch)=>{

    try{

      console.log("rideId in thunk",rideId);
      const response=await apiConnector('GET',GET_RIDE_DETAILS(rideId),{},{
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      })

      console.log("response of getRideDetails....",response);

      dispatch(setCurrentRide(response.data.ride));


    }
    catch(error){

      console.log("error in getting rideDetails",error);
      console.log("Errr",error.response?.data)
      dispatch(
              setError(
                error.response?.data?.message ||
                  "Error in getting Ride Details!"
              )
            );

    }finally{

    }
  }


 
export const getActiveRide=({token})=>async(dispatch)=>{
  try{

     const response=await apiConnector('GET',ACTIVE_RIDE,{},{
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      })

      console.log("response of getActive RIder",response);

      dispatch(setCurrentRide(response.data.ride))

  }catch(error){
     console.log("error in getting rideDetails",error);
      console.log("Errr",error.response?.data)
  }
}
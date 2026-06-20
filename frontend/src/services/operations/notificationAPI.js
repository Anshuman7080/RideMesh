import {apiConnector } from "../apiconnector"

import {
    setLoading,
    setError,
    setNotifications,
    markNotificationRead,
    markAllNotificationsRead,
} from "../../slices/notificationSlice";

import { notificationEndPoints } from "../apis";

const {GET_MY_NOTIFICATIONS,MARK_AS_READ,MARK_ALL_AS_READ}=notificationEndPoints

 export const getMyNotifications =({token}) => async (dispatch) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const response = await apiConnector("GET",GET_MY_NOTIFICATIONS,{},
        {
          Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
        }
  
      );
      // console.log("response of gat my notifications",response);

      dispatch(
        setNotifications(
          response.data.notifications || []
        )
      );
    } catch (error) {

      console.log("error in getting notification",error);
      console.log("error in getting notification", error.response?.data);
      dispatch(
        setError(
          error.response?.data?.message ||
            "Failed to fetch notifications"
        )
      );
    } finally {
      dispatch(setLoading(false));
    }
  };


  export const markRead =({notificationId,token}) => async (dispatch) => {
    try {
     const response= await apiConnector("PATCH",MARK_AS_READ(notificationId),{},{
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      }
       
      );
      // console.log("response of markRead",response);

      dispatch(
        markNotificationRead(notificationId)
      );
    } catch (error) {
      console.log("erorr in marking read",error);
      console.log("error.response?.data?.message ",error.response?.data)
      dispatch(
        setError(
          error.response?.data?.message ||
            "Failed to mark notification as read"
        )
      );
    }
  };


  export const markAllRead =
  ({token}) => async (dispatch) => {
    try {
      const response= await apiConnector("PATCH",MARK_ALL_AS_READ,{},{
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      }
       
      );

      // console.log("response of markAllRead",response);

      dispatch(markAllNotificationsRead());
    } catch (error) {
      console.log("Error in mark all read",error);
      dispatch(
        setError(
          error.response?.data?.message ||
            "Failed to mark all notifications as read"
        )
      );
    }
  };
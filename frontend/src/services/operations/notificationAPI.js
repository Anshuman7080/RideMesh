import {apiConnector } from "../apiconnector"

import {
    setLoading,
    setError,
    setNotifications,
    markNotificationRead,
    markAllNotificationsRead,
} from "../../slices/notificationSlice";

 export const getMyNotifications =
  () => async (dispatch) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const response = await apiConnector(
        "/notifications/my-notifications"
      );

      dispatch(
        setNotifications(
          response.data.notifications || []
        )
      );
    } catch (error) {
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


  export const markRead =
  (notificationId) => async (dispatch) => {
    try {
      await apiConnector(
        `/notifications/${notificationId}/read`
      );

      dispatch(
        markNotificationRead(notificationId)
      );
    } catch (error) {
      dispatch(
        setError(
          error.response?.data?.message ||
            "Failed to mark notification as read"
        )
      );
    }
  };


  export const markAllRead =
  () => async (dispatch) => {
    try {
      await apiConnector(
        "/notifications/read-all"
      );

      dispatch(markAllNotificationsRead());
    } catch (error) {
      dispatch(
        setError(
          error.response?.data?.message ||
            "Failed to mark all notifications as read"
        )
      );
    }
  };
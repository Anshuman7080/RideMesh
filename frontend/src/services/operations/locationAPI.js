import {apiConnector } from "../apiconnector"
import {
  setLoading,
  setError,
  setOnlineStatus,
  setCurrentLocation,
} from "../../slices/locationSlice";



export const setDriverOnline = () => async (dispatch) => {
  dispatch(setLoading(true));
  dispatch(setError(null));

  try {
    await apiConnector("/rides/drivers/online");

    dispatch(setOnlineStatus(true));
  } catch (error) {
    dispatch(
      setError(
        error.response?.data?.message ||
          "Failed to go online"
      )
    );

    dispatch(setOnlineStatus(false));
  } finally {
    dispatch(setLoading(false));
  }
};



export const setDriverOffline = () => async (dispatch) => {
  dispatch(setLoading(true));
  dispatch(setError(null));

  try {
    await apiConnector("/rides/drivers/offline");

    dispatch(setOnlineStatus(false));
  } catch (error) {
    dispatch(
      setError(
        error.response?.data?.message ||
          "Failed to go offline"
      )
    );
  } finally {
    dispatch(setLoading(false));
  }
};




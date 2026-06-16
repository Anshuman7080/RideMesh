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



export const createRide =
  ({ pickup, dropoff, distanceKm }) =>
  async (dispatch) => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    dispatch(setBookingStatus("searching"));

    try {
      const response = await apiConnector("/rides/create", {
        pickup,
        dropoff,
        distanceKm,
      });

      const ride = response.data.ride;

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

export const getRideDetails =
  (rideId) => async (dispatch) => {
    try {
      const response = await apiConnector(`/rides/${rideId}`);

      const ride = response.data.ride;

      dispatch(setCurrentRide(ride));

      const history =
        JSON.parse(localStorage.getItem("rideHistory")) || [];

      const updated = history.map((r) =>
        r._id === ride._id ? ride : r
      );

      dispatch(setRideHistory(updated));
    } catch (error) {
      dispatch(
        setError(
          error.response?.data?.message ||
            "Failed to fetch ride details"
        )
      );
    }
  };

export const cancelRide =
  ({ rideId, reason }) =>
  async (dispatch) => {
    try {
      await apiConnector(`/rides/${rideId}/cancel`, { reason });

      dispatch(setBookingStatus("cancelled"));

      const history =
        JSON.parse(localStorage.getItem("rideHistory")) || [];

      const updated = history.map((r) =>
        r._id === rideId
          ? { ...r, status: "CANCELLED" }
          : r
      );

      dispatch(setRideHistory(updated));
    } catch (error) {
      dispatch(
        setError(
          error.response?.data?.message ||
            "Failed to cancel ride"
        )
      );
    }
  };

export const rateDriver =
  ({ rideId, rating }) =>
  async (dispatch) => {
    try {
      await apiConnector(`/rides/${rideId}/rate-driver`, {
        rating,
      });

      const history =
        JSON.parse(localStorage.getItem("rideHistory")) || [];

      const updated = history.map((r) =>
        r._id === rideId
          ? { ...r, riderRating: rating }
          : r
      );

      dispatch(setRideHistory(updated));
    } catch (error) {
      dispatch(
        setError(
          error.response?.data?.message ||
            "Failed to submit rating"
        )
      );
    }
  };

export const getNearbyDrivers =
  ({ latitude, longitude }) =>
  async (dispatch) => {
    try {
      const response = await apiConnector(
        "/rides/drivers/nearby",
        {
          params: { latitude, longitude },
        }
      );

      const rawDrivers = response.data.drivers || [];

      const drivers = rawDrivers.map((d) => ({
        driverId: Array.isArray(d) ? d[0] : d,
        distanceKm: Array.isArray(d) ? Number(d[1]) : 0,
      }));

      dispatch(setNearbyDrivers(drivers));
    } catch (error) {
      dispatch(
        setError(
          error.response?.data?.message ||
            "Failed to fetch nearby drivers"
        )
      );
    }
  };



export const getDriverRequests = () => async (dispatch) => {
  dispatch(setLoading(true));

  try {
    const response = await apiConnector("/rides/request");

    dispatch(setDriverRequests(response.data.requests || []));
  } catch (error) {
    dispatch(
      setError(
        error.response?.data?.message ||
          "Failed to fetch ride requests"
      )
    );
  } finally {
    dispatch(setLoading(false));
  }
};

export const acceptRide =
  (rideId) => async (dispatch) => {
    dispatch(setLoading(true));

    try {
      const response = await apiConnector(
        `/rides/${rideId}/accept`
      );

      dispatch(setCurrentRide(response.data.ride));

      const current =
        JSON.parse(localStorage.getItem("driverRequests")) ||
        [];

      const filtered = current.filter(
        (r) => r.rideId !== rideId
      );

      dispatch(setDriverRequests(filtered));
    } catch (error) {
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

export const rejectRide =
  (rideId) => async (dispatch) => {
    try {
      await apiConnector(`/rides/${rideId}/reject`);

      const current =
        JSON.parse(localStorage.getItem("driverRequests")) ||
        [];

      const filtered = current.filter(
        (r) => r.rideId !== rideId
      );

      dispatch(setDriverRequests(filtered));
    } catch (error) {
      dispatch(
        setError(
          error.response?.data?.message ||
            "Failed to reject ride"
        )
      );
    }
  };

export const driverArrived =
  (rideId) => async (dispatch) => {
    try {
      const response = await apiConnector(
        `/rides/${rideId}/arrive`
      );

      dispatch(setCurrentRide(response.data.ride));
    } catch (error) {
      dispatch(
        setError(
          error.response?.data?.message ||
            "Failed to update status"
        )
      );
    }
  };

export const startRide =
  (rideId) => async (dispatch) => {
    try {
      const response = await apiConnector(
        `/rides/${rideId}/start`
      );

      dispatch(setCurrentRide(response.data.ride));
    } catch (error) {
      dispatch(
        setError(
          error.response?.data?.message ||
            "Failed to start ride"
        )
      );
    }
  };

export const completeRide =
  (rideId) => async (dispatch) => {
    try {
      const response = await apiConnector(
        `/rides/${rideId}/complete`
      );

      const ride = response.data.ride;

      dispatch(setCurrentRide(ride));

      const history =
        JSON.parse(localStorage.getItem("rideHistory")) || [];

      const exists = history.find((r) => r._id === ride._id);

      let updated;

      if (!exists) {
        updated = [ride, ...history];
      } else {
        updated = history.map((r) =>
          r._id === ride._id ? ride : r
        );
      }

      dispatch(setRideHistory(updated));
    } catch (error) {
      dispatch(
        setError(
          error.response?.data?.message ||
            "Failed to complete ride"
        )
      );
    }
  };

export const driverCancelRide =
  ({ rideId, reason }) =>
  async (dispatch) => {
    try {
      await apiConnector(`/rides/${rideId}/driver-cancel`, {
        reason,
      });

      const history =
        JSON.parse(localStorage.getItem("rideHistory")) || [];

      const updated = history.map((r) =>
        r._id === rideId
          ? { ...r, status: "CANCELLED" }
          : r
      );

      dispatch(setRideHistory(updated));
    } catch (error) {
      dispatch(
        setError(
          error.response?.data?.message ||
            "Failed to cancel ride"
        )
      );
    }
  };

export const rateRider =
  ({ rideId, rating }) =>
  async (dispatch) => {
    try {
      await apiConnector(`/rides/${rideId}/rate-rider`, {
        rating,
      });

      const history =
        JSON.parse(localStorage.getItem("rideHistory")) || [];

      const updated = history.map((r) =>
        r._id === rideId
          ? { ...r, driverRating: rating }
          : r
      );

      dispatch(setRideHistory(updated));
    } catch (error) {
      dispatch(
        setError(
          error.response?.data?.message ||
            "Failed to submit rider rating"
        )
      );
    }
  };
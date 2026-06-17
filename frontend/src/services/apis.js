const BASEURL=" http://localhost:5000";

export const authEndPoints={
   SEND_OTP :BASEURL + "/api/v1/auth/send-otp",
   VERIFY_OTP:BASEURL + "/api/v1/auth/verify-otp",
   RESEND_OTP:BASEURL + "/api/v1/auth/resend-otp",
   LOGIN : BASEURL + "/api/v1/auth/login",

}

export const rideEndPoints = {
 
  CREATE_RIDE: BASEURL + "/api/v1/rides/create",
  GET_RIDE_DETAILS: (rideId) => BASEURL + `/api/v1/rides/${rideId}`,
  GET_DRIVER_REQUESTS: BASEURL + "/api/v1/rides/request",


  CANCEL_RIDE: (rideId) => BASEURL + `/api/v1/rides/${rideId}/cancel`,
  RATE_DRIVER: (rideId) => BASEURL + `/api/v1/rides/${rideId}/rate-driver`,
  RATE_RIDER: (rideId) => BASEURL + `/api/v1/rides/${rideId}/rate-rider`,

  
  ACCEPT_RIDE: (rideId) => BASEURL + `/api/v1/rides/${rideId}/accept`,
  REJECT_RIDE: (rideId) => BASEURL + `/api/v1/rides/${rideId}/reject`,
  DRIVER_ARRIVED: (rideId) => BASEURL + `/api/v1/rides/${rideId}/arrive`,
  START_RIDE: (rideId) => BASEURL + `/api/v1/rides/${rideId}/start`,
  COMPLETE_RIDE: (rideId) => BASEURL + `/api/v1/rides/${rideId}/complete`,
  DRIVER_CANCEL: (rideId) => BASEURL + `/api/v1/rides/${rideId}/driver-cancel`,
};
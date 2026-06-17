const BASEURL=" http://localhost:5000";

export const authEndPoints={
   SEND_OTP :BASEURL + "/api/v1/auth/send-otp",
   VERIFY_OTP:BASEURL + "/api/v1/auth/verify-otp",
   RESEND_OTP:BASEURL + "/api/v1/auth/resend-otp",
   LOGIN : BASEURL + "/api/v1/auth/login",

}




import axios from "axios";
import { logoutUser } from "./operations/authAPI";
import store from "../store/index"

const BASEURL=import.meta.env.VITE_API_URL || " http://localhost:5000";


export const axiosInstance = axios.create({
  withCredentials: true,
});




axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!error.response) {
      return Promise.reject(error);
    }
console.log("coming in refresh token interceptor 1");

 const authRoutes = [
      "/api/v1/auth/login",
      "/api/v1/auth/send-otp",
      "/api/v1/auth/verify-otp",
      "/api/v1/auth/resend-otp",
      "/api/v1/auth/refresh-token",
    ];
    
     const isAuthRoute = authRoutes.some((route) =>
      originalRequest.url.includes(route)
    );

    if (error.response.status === 401 && !originalRequest._retry && !isAuthRoute) {
      originalRequest._retry = true;
      console.log("coming in refresh token interceptor 2");
      try {
        const res = await axios.post(
          `${BASEURL}/api/v1/auth/refresh-token`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = res.data.accessToken;

        console.log("newAccessToken is",newAccessToken)

       
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return axiosInstance(originalRequest);
      } catch (refreshError) {

         store.dispatch(logoutUser()); 
        console.log("error in refresh token",refreshError);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const apiConnector=(method,url,bodyData,headers,params)=>{
    return axiosInstance({
        method:`${method}`,
        url:`${url}`,
        data:bodyData?bodyData:null,
        headers:headers?headers:null,
        params:params?params:null,
    });
}
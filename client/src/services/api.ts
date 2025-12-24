import axios from 'axios';
import {store} from '../redux/store'

  const API = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL  || "http://localhost:3000",
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });

  API.interceptors.response.use(
    response => response,
    async error => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry){
        originalRequest._retry = true;
        try{
          const userId = store.getState().auth.user?._id;

          if (!userId && window.location.pathname !== '/signin') {
            window.location.href = "/signin";
            return Promise.reject("No userId to refresh token");
          }

          await API.post("/auth/refresh-token", { userId });
          return API(originalRequest);
        }catch (err) {
          window.location.href = "/signin";
          return Promise.reject(err);
        }
      }
      return Promise.reject(error);
    }
  )

  export default API;
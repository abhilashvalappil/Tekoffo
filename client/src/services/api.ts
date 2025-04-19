import axios from 'axios';

  const API = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL  || "http://localhost:3000",
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });

  export default API;
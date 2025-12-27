
import axios from 'axios';

export default axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || "http://localhost:3000",
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
  }
});



import { useEffect } from "react";
import socket from "../../utils/socket"; 
import { useDispatch } from "react-redux";
import { logout } from "../../redux/services/authService";   
import { AppDispatch } from "../../redux/store";
import { useNavigate } from "react-router-dom";


export interface User {
    _id: string;
    username: string;
    email: string;
    role: string;
    isBlocked: boolean;
  }
  
  export const useSocketConnection = (user: User | null) => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
  
    useEffect(() => {
      if (user?._id) {
        console.log("Socket connecting...");
  
        socket.connect();
        socket.emit("user:join", user._id);
  
        socket.on("user:blocked", async () => {
          try {
            await dispatch(logout(user._id));  
          } catch (err) {
            console.error("Logout failed:", err);
          }
  
          socket.disconnect();
          // window.location.href = "/signin";
          navigate("/blocked");
        });
      }
  
      return () => {
        socket.off("user:blocked");
        socket.disconnect();
      };
    }, [user, dispatch, navigate]);
  };
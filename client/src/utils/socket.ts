// src/socket.ts
import { io, Socket } from "socket.io-client";


const URL = "http://localhost:3000";  

const socket: Socket = io(URL, {
  withCredentials: true,
  autoConnect: false,
  transports: ["websocket"],
});

export default socket;

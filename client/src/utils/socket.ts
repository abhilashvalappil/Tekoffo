import { io, Socket } from "socket.io-client";

const URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000"  

const socket: Socket = io(URL, {
  withCredentials: true,
  autoConnect: false,
  transports: ["websocket"],
  forceNew: false,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5,
  timeout: 20000,
});

// Add connection event listeners for debugging
socket.on('connect', () => {
  console.log('Socket connected with ID:', socket.id);
});

socket.on('disconnect', (reason) => {
  console.log('Socket disconnected:', reason);
});

socket.on('connect_error', (error) => {
  console.error('Socket connection error:', error);
});

export default socket;
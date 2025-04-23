import { Server, Socket } from "socket.io";

export const onlineUsers = new Map<string, string>();  

export const setupSocketEvents = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("user:join", (userId: string) => {
      onlineUsers.set(userId, socket.id);
      console.log("User joined:", userId);
      console.log("Current online users:", onlineUsers);
    });

    socket.on("disconnect", () => {
      for (const [uid, sid] of onlineUsers.entries()) {
        if (sid === socket.id) onlineUsers.delete(uid);
      }
    });
  });
};

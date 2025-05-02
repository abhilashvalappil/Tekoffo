import { Server, Socket } from "socket.io";

export const onlineUsers = new Map<string, string>();  

export const setupSocketEvents = (io: Server) => {
  //* Listen for incoming Socket.IO connections
  io.on("connection", (socket: Socket) => {
  

    socket.on("user:join", (userId: string) => {
      onlineUsers.set(userId, socket.id);
    });

    socket.on("disconnect", () => {
      for (const [uid, sid] of onlineUsers.entries()) {
        if (sid === socket.id) onlineUsers.delete(uid);
      }
    });
  });
};

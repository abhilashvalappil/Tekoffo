import { Server, Socket } from "socket.io";

export const onlineUsers = new Map<string, string>();  

export const setupSocketEvents = (io: Server) => {
  //* Listen for incoming Socket.IO connections
  io.on("connection", (socket: Socket) => {
  

    socket.on("user:join", (userId: string) => {
      onlineUsers.set(userId, socket.id);
    });

    //* chat
    socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`${socket.id} joined room ${roomId}`);
  });

   socket.on('send-message', ({ roomId, message }) => {
     console.log('console from socketmanagerr.tss message sendedddd',message)
    socket.to(roomId).emit('receive-message', message);
    console.log('console from socketmanagerr.tss message receivedd',message)
  });

  //** */

    socket.on("disconnect", () => {
      for (const [uid, sid] of onlineUsers.entries()) {
        if (sid === socket.id) onlineUsers.delete(uid);
      }
    });
  });
};

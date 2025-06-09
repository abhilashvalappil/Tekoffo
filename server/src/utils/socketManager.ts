 
import { Server, Socket } from "socket.io";

export const onlineUsers = new Map<string, string>();

export const setupSocketEvents = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on("user:join", (userId: string) => {
      onlineUsers.set(userId, socket.id);
     
      io.emit('update-user-status', { userId, isOnline: true });
    });

    socket.on('get:online-users', () => {
      const currentOnlineUsers = Array.from(onlineUsers.keys());
      socket.emit('online-users-list', currentOnlineUsers);
      console.log('Sent online users list to client:', currentOnlineUsers);
    });

    // Chat room management
    socket.on('join_room', (roomId) => {
      socket.join(roomId);
      console.log(`${socket.id} joined room ${roomId}`);

      socket.to(roomId).emit('user-joined');
      console.log(`Emitted 'user-joined' to room ${roomId}`);
    });

    socket.on('send_message', ({ chatId, content,mediaUrl, receiverId, senderId, _id }) => {
      const receiverSocketId = onlineUsers.get(receiverId);
      
      const messageData = {
        _id,
        chatId,
        content,
        mediaUrl,
        senderId,
        timestamp: new Date(),
      };

      // *Send to chat room
      socket.to(chatId).emit('receive_message', messageData);
      console.log('Message sent to chat room:', content);

      //* Send notification to receiver if they're online (for unread count)
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('new-message', messageData);
        console.log(`Notification sent to receiver ${receiverId}`);
      }
    });
 
    socket.on('leave_room', (roomId) => {
      socket.leave(roomId);
      console.log(`${socket.id} left room ${roomId}`);
    });

    // Handle message read status
    socket.on('messages_read', ({ chatId, userId }) => {
      socket.to(chatId).emit('messages_read_by', { chatId, userId });
    });

    //* Typing indicators
    socket.on("typing", ({ roomId, senderId }) => {
      socket.to(roomId).emit("typing", { senderId });
    });

    socket.on("stop_typing", ({ roomId, senderId }) => {
      socket.to(roomId).emit("stop_typing", { senderId });
    });

    socket.on('delete_message',({messageId,chatId,content, mediaUrl}) => {
      io.to(chatId).emit('message_deleted', { messageId, chatId, content, mediaUrl  });
    })


    //* videoooo

    socket.on('initiate_call', ({ roomId }) => {
    console.log("Call initiated in room:", roomId);
    socket.to(roomId).emit('incoming_call', { sender: socket.id });
});

//* Handle call decline
socket.on('decline_call', ({ roomId }) => {
    console.log("Call declined in room:", roomId);
    socket.to(roomId).emit('call_declined', { sender: socket.id });
});

     socket.on('offer', ({ offer, roomId }) => {
        socket.to(roomId).emit('offer', { offer, sender: socket.id });
         console.log("Forwarded offer to room:", roomId);
    });

    socket.on('answer', ({ answer, roomId }) => {
        socket.to(roomId).emit('answer', { answer, sender: socket.id });
        console.log("Forwarded answer to room:", roomId);
    });

    socket.on('ice-candidate', ({ candidate, roomId }) => {
        socket.to(roomId).emit('ice-candidate', { candidate, sender: socket.id });
    });

    socket.on('call_ended',({ roomId }) => {
      socket.to(roomId).emit('call_ended',{ sender: socket.id })
      console.log("Call ended in room:", roomId);
    })

    //**************** */

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
      
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          console.log(`User ${userId} went offline`);
          console.log('Current online users:', Array.from(onlineUsers.keys()));
          
           
          io.emit('update-user-status', { userId, isOnline: false });
          break;
        }
      }
    });
  });
};

export const isUserOnline = (userId: string) => {
  return onlineUsers.has(userId);
};

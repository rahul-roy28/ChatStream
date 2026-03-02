import { createContext, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import useChatStore from "../store/useChatStore";

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const {
    currentUser,
    setOnlineUsers,
    addMessage,
    setIsTyping,
    incrementUnread,
    markMessagesAsRead,
    token,
    deleteMessageForEveryone,
  } = useChatStore();

  useEffect(() => {
    if (!currentUser) return;

    socketRef.current = io(
      import.meta.env.VITE_BACKEND_URL || "http://localhost:5000",
      {
        query: { userId: currentUser._id },
        auth: { token },
      },
    );

    // Online users
    socketRef.current.on("getOnlineUsers", (users) => {
      setOnlineUsers(users);
    });

    // New message
    socketRef.current.on("newMessage", (message) => {
      const { selectedUser } = useChatStore.getState();
      if (selectedUser && message.senderId === selectedUser._id) {
        addMessage(message);
      } else {
        incrementUnread(message.senderId);
      }
    });

    // Typing
    socketRef.current.on("typing", ({ senderId }) => {
      const { selectedUser } = useChatStore.getState();
      if (selectedUser && senderId === selectedUser._id) {
        setIsTyping(true);
      }
    });

    // Stop typing
    socketRef.current.on("stopTyping", ({ senderId }) => {
      const { selectedUser } = useChatStore.getState();
      if (selectedUser && senderId === selectedUser._id) {
        setIsTyping(false);
      }
    });

    // Messages read
    socketRef.current.on("messagesRead", ({ receiverId }) => {
      const { selectedUser } = useChatStore.getState();
      if (selectedUser && selectedUser._id === receiverId) {
        markMessagesAsRead(currentUser._id);
      }
    });

    // Message deleted for everyone
    socketRef.current.on("messageDeleted", ({ messageId }) => {
      useChatStore.getState().deleteMessageForEveryone(messageId);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [currentUser]);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current }}>
      {children}
    </SocketContext.Provider>
  );
};

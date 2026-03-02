import { create } from "zustand";

const useChatStore = create((set) => ({
  currentUser: null,
  token: localStorage.getItem("chatstream_token") || null,
  selectedUser: null,
  messages: [],
  onlineUsers: [],
  isTyping: false,
  unreadCounts: {},

  setCurrentUser: (user) => set({ currentUser: user }),
  setToken: (token) => {
    if (token) localStorage.setItem("chatstream_token", token);
    else localStorage.removeItem("chatstream_token");
    set({ token });
  },
  setSelectedUser: (user) =>
    set((state) => ({
      selectedUser: user,
      unreadCounts: user
        ? { ...state.unreadCounts, [user._id]: 0 }
        : state.unreadCounts,
    })),
  setMessages: (messages) => set({ messages }),
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  setOnlineUsers: (users) => set({ onlineUsers: users }),
  setIsTyping: (val) => set({ isTyping: val }),
  incrementUnread: (userId) =>
    set((state) => ({
      unreadCounts: {
        ...state.unreadCounts,
        [userId]: (state.unreadCounts[userId] || 0) + 1,
      },
    })),
  clearUnread: (userId) =>
    set((state) => ({
      unreadCounts: { ...state.unreadCounts, [userId]: 0 },
    })),
  markMessagesAsRead: (senderId) =>
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.senderId === senderId ? { ...msg, isRead: true } : msg,
      ),
    })),
  deleteMessageForMe: (messageId) =>
    set((state) => ({
      messages: state.messages.filter((msg) => msg._id !== messageId),
    })),
  deleteMessageForEveryone: (messageId) =>
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg._id === messageId
          ? { ...msg, deletedForEveryone: true, message: "", image: "" }
          : msg,
      ),
    })),
  logout: () => {
    localStorage.removeItem("chatstream_token");
    set({
      currentUser: null,
      token: null,
      selectedUser: null,
      messages: [],
      onlineUsers: [],
      unreadCounts: {},
    });
  },
}));

export default useChatStore;

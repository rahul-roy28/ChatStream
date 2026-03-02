import React, { useEffect, useRef, useState } from "react";
import axios from "../utils/axios.js";
import EmojiPicker from "emoji-picker-react";
import useChatStore from "../store/useChatStore";
import { useSocket } from "../context/SocketContext";

const ChatWindow = ({ onBack }) => {
  const {
    currentUser,
    selectedUser,
    messages,
    setMessages,
    addMessage,
    onlineUsers,
    isTyping,
    deleteMessageForMe,
    deleteMessageForEveryone,
  } = useChatStore();
  const { socket } = useSocket();
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [hoveredMsg, setHoveredMsg] = useState(null);
  const [showDeleteMenu, setShowDeleteMenu] = useState(null);
  const typingTimeoutRef = useRef(null);
  const bottomRef = useRef(null);
  const fileInputRef = useRef(null);

  const getInitials = (name) => name.slice(0, 2).toUpperCase();
  const avatarColors = [
    "linear-gradient(135deg, #0369a1, #22d3ee)",
    "linear-gradient(135deg, #0d9488, #14b8a6)",
    "linear-gradient(135deg, #7c3aed, #a78bfa)",
    "linear-gradient(135deg, #db2777, #f472b6)",
    "linear-gradient(135deg, #d97706, #fbbf24)",
  ];
  const getAvatarColor = (name) => {
    const index = name.charCodeAt(0) % avatarColors.length;
    return avatarColors[index];
  };

  useEffect(() => {
    if (!selectedUser) return;
    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `/api/messages/${selectedUser._id}?senderId=${currentUser._id}`,
        );
        setMessages(res.data);
        if (socket) {
          socket.emit("markAsRead", {
            senderId: selectedUser._id,
            receiverId: currentUser._id,
          });
        }
      } catch (err) {
        console.log("Error fetching messages:", err);
      }
    };
    fetchMessages();
  }, [selectedUser, socket]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleTyping = (e) => {
    setText(e.target.value);
    if (!socket || !selectedUser) return;
    socket.emit("typing", { receiverId: selectedUser._id });
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", { receiverId: selectedUser._id });
    }, 1500);
  };

  const handleEmojiClick = (emojiData) => {
    setText((prev) => prev + emojiData.emoji);
    setShowEmoji(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleDeleteForMe = async (messageId) => {
    try {
      await axios.delete(`/api/messages/delete-for-me/${messageId}`, {
        data: { userId: currentUser._id },
      });
      deleteMessageForMe(messageId);
      setShowDeleteMenu(null);
    } catch (err) {
      console.log("Error deleting message:", err);
    }
  };

  const handleDeleteForEveryone = async (messageId) => {
    try {
      await axios.delete(`/api/messages/delete-for-everyone/${messageId}`, {
        data: { userId: currentUser._id },
      });
      deleteMessageForEveryone(messageId);
      setShowDeleteMenu(null);
    } catch (err) {
      console.log("Error deleting message:", err);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if ((!text.trim() && !imagePreview) || sending) return;
    try {
      setSending(true);
      const res = await axios.post(`/api/messages/send/${selectedUser._id}`, {
        senderId: currentUser._id,
        message: text.trim(),
        image: imagePreview || "",
      });
      addMessage(res.data);
      setText("");
      setImagePreview(null);
      setShowEmoji(false);
      if (socket) {
        socket.emit("stopTyping", { receiverId: selectedUser._id });
      }
    } catch (err) {
      console.log("Error sending message:", err);
    } finally {
      setSending(false);
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isOnline = onlineUsers.includes(selectedUser?._id);

  if (!selectedUser) {
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#080e1a",
          height: "100%",
          width: "100%",
        }}
      >
        <div style={{ fontSize: "4rem", marginBottom: "16px" }}>🌊</div>
        <h3
          style={{
            fontFamily: "'Sora', sans-serif",
            color: "#22d3ee",
            fontSize: "1.3rem",
            marginBottom: "8px",
          }}
        >
          Welcome to ChatStream
        </h3>
        <p style={{ color: "#1e4a5a", fontSize: "0.9rem" }}>
          Select a user from the sidebar to start chatting
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        background: "#080e1a",
        height: "100%",
        position: "relative",
      }}
    >
      {/* Chat Header */}
      <div
        style={{
          padding: "14px 20px",
          background: "#0c1525",
          borderBottom: "1px solid rgba(34,211,238,0.08)",
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <button
          className="back-btn"
          onClick={() => onBack && onBack()}
          style={{
            alignItems: "center",
            justifyContent: "center",
            background: "transparent",
            border: "none",
            color: "#22d3ee",
            fontSize: "1.3rem",
            cursor: "pointer",
            padding: "4px 8px 4px 0px",
            flexShrink: 0,
          }}
        >
          ←
        </button>

        <div style={{ position: "relative", maxWidth: "65%" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: selectedUser.profilePic
                ? "transparent"
                : getAvatarColor(selectedUser.username),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "700",
              fontSize: "0.8rem",
              color: "white",
              fontFamily: "'Sora', sans-serif",
              overflow: "hidden",
            }}
          >
            {selectedUser.profilePic ? (
              <img
                src={selectedUser.profilePic}
                alt="avatar"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              getInitials(selectedUser.username)
            )}
          </div>
          <div
            style={{
              position: "absolute",
              bottom: "1px",
              right: "1px",
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: isOnline ? "#22c55e" : "#475569",
              border: "2px solid #0c1525",
            }}
          />
        </div>
        <div>
          <div
            style={{
              color: "#bde4f5",
              fontWeight: "700",
              fontSize: "0.95rem",
              fontFamily: "'Sora', sans-serif",
            }}
          >
            {selectedUser.username}
          </div>
          <div
            style={{
              fontSize: "0.72rem",
              color: isOnline ? "#22c55e" : "#4a6a7a",
            }}
          >
            {isOnline ? "● Online" : "○ Offline"}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "20px 16px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
        onClick={() => setShowDeleteMenu(null)}
      >
        {messages.length === 0 && (
          <div
            style={{
              textAlign: "center",
              marginTop: "60px",
              color: "#1e4a5a",
              fontSize: "0.85rem",
            }}
          >
            No messages yet · Say hello! 👋
          </div>
        )}

        {messages.map((msg) => {
          const isSent = msg.senderId === currentUser._id;
          return (
            <div
              key={msg._id}
              style={{
                display: "flex",
                justifyContent: isSent ? "flex-end" : "flex-start",
                position: "relative",
              }}
              onMouseEnter={() => setHoveredMsg(msg._id)}
              onMouseLeave={() => {
                setHoveredMsg(null);
                setShowDeleteMenu(null);
              }}
            >
              <div style={{ position: "relative" }}>
                {/* Delete menu trigger button */}
                {hoveredMsg === msg._id && !msg.deletedForEveryone && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDeleteMenu(
                        showDeleteMenu === msg._id ? null : msg._id,
                      );
                    }}
                    style={{
                      position: "absolute",
                      top: "6px",
                      [isSent ? "left" : "right"]: "-24px",
                      background: "rgba(12,21,37,0.9)",
                      border: "1px solid rgba(34,211,238,0.15)",
                      borderRadius: "50%",
                      width: "20px",
                      height: "20px",
                      color: "#4a8fa0",
                      cursor: "pointer",
                      fontSize: "0.7rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      zIndex: 10,
                    }}
                  >
                    ▾
                  </button>
                )}

                {/* Delete dropdown */}
                {showDeleteMenu === msg._id && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      position: "absolute",
                      top: "28px",
                      [isSent ? "right" : "left"]: "0px",
                      background: "#0c1525",
                      border: "1px solid rgba(34,211,238,0.15)",
                      borderRadius: "12px",
                      padding: "6px",
                      zIndex: 100,
                      minWidth: "170px",
                      boxShadow: "0 8px 30px rgba(0,0,0,0.5)",
                    }}
                  >
                    <button
                      onClick={() => handleDeleteForMe(msg._id)}
                      style={{
                        width: "100%",
                        padding: "9px 12px",
                        background: "transparent",
                        border: "none",
                        color: "#bde4f5",
                        fontSize: "0.82rem",
                        cursor: "pointer",
                        textAlign: "left",
                        borderRadius: "8px",
                        transition: "background 0.2s",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background =
                          "rgba(34,211,238,0.08)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      🙈 Delete for me
                    </button>

                    {isSent && (
                      <button
                        onClick={() => handleDeleteForEveryone(msg._id)}
                        style={{
                          width: "100%",
                          padding: "9px 12px",
                          background: "transparent",
                          border: "none",
                          color: "#f87171",
                          fontSize: "0.82rem",
                          cursor: "pointer",
                          textAlign: "left",
                          borderRadius: "8px",
                          transition: "background 0.2s",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background =
                            "rgba(239,68,68,0.08)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "transparent")
                        }
                      >
                        🗑️ Delete for everyone
                      </button>
                    )}
                  </div>
                )}

                {/* Message bubble */}
                <div
                  style={{
                    padding: msg.deletedForEveryone
                      ? "10px 14px"
                      : msg.image && !msg.message
                        ? "6px"
                        : "10px 14px",
                    borderRadius: isSent
                      ? "18px 18px 4px 18px"
                      : "18px 18px 18px 4px",
                    background: msg.deletedForEveryone
                      ? "transparent"
                      : isSent
                        ? "linear-gradient(135deg, #1a3a5c, #0e4d6e)"
                        : "#101d30",
                    color: isSent ? "white" : "#bde4f5",
                    fontSize: "0.88rem",
                    lineHeight: "1.5",
                    boxShadow: msg.deletedForEveryone
                      ? "none"
                      : isSent
                        ? "0 4px 15px rgba(14,77,110,0.3)"
                        : "0 2px 8px rgba(0,0,0,0.3)",
                    border: msg.deletedForEveryone
                      ? "1px dashed rgba(34,211,238,0.15)"
                      : isSent
                        ? "none"
                        : "1px solid rgba(34,211,238,0.08)",
                  }}
                >
                  {/* Deleted message placeholder */}
                  {msg.deletedForEveryone ? (
                    <div
                      style={{
                        color: "#4a6a7a",
                        fontStyle: "italic",
                        fontSize: "0.82rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      🚫 This message was deleted
                    </div>
                  ) : (
                    <>
                      {msg.image && (
                        <img
                          src={msg.image}
                          alt="shared"
                          style={{
                            maxWidth: "100%",
                            borderRadius: "12px",
                            display: "block",
                            marginBottom: msg.message ? "6px" : "0",
                            cursor: "pointer",
                          }}
                          onClick={() => window.open(msg.image, "_blank")}
                        />
                      )}
                      {msg.message && <div>{msg.message}</div>}
                    </>
                  )}

                  {/* Time + ticks */}
                  {!msg.deletedForEveryone && (
                    <div
                      style={{
                        fontSize: "0.62rem",
                        opacity: 0.6,
                        marginTop: "4px",
                        textAlign: "right",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        gap: "3px",
                      }}
                    >
                      {formatTime(msg.createdAt)}
                      {isSent && (
                        <span
                          style={{
                            fontSize: "0.75rem",
                            marginLeft: "2px",
                            fontWeight: "900",
                            color: msg.isRead
                              ? "#00FF9D"
                              : "rgba(255,255,255,0.4)",
                            textShadow: msg.isRead
                              ? "0 0 6px #22d3ee, 0 0 12px #22d3ee"
                              : "none",
                            transition: "all 0.3s ease",
                          }}
                        >
                          ✓✓
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing Indicator */}
        {isTyping && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "4px 0",
            }}
          >
            <div
              style={{
                background: "#101d30",
                border: "1px solid rgba(34,211,238,0.08)",
                borderRadius: "18px 18px 18px 4px",
                padding: "10px 16px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span
                style={{
                  color: "#4a8fa0",
                  fontSize: "0.75rem",
                  fontStyle: "italic",
                }}
              >
                {selectedUser.username} is typing
              </span>
              <style>{`
                @keyframes bounce {
                  0%, 60%, 100% { transform: translateY(0); }
                  30% { transform: translateY(-4px); }
                }
                .dot1 { animation: bounce 1.2s infinite 0s; }
                .dot2 { animation: bounce 1.2s infinite 0.2s; }
                .dot3 { animation: bounce 1.2s infinite 0.4s; }
              `}</style>
              <div
                style={{ display: "flex", gap: "3px", alignItems: "center" }}
              >
                <div
                  className="dot1"
                  style={{
                    width: "5px",
                    height: "5px",
                    borderRadius: "50%",
                    background: "#22d3ee",
                  }}
                />
                <div
                  className="dot2"
                  style={{
                    width: "5px",
                    height: "5px",
                    borderRadius: "50%",
                    background: "#22d3ee",
                  }}
                />
                <div
                  className="dot3"
                  style={{
                    width: "5px",
                    height: "5px",
                    borderRadius: "50%",
                    background: "#22d3ee",
                  }}
                />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Image Preview */}
      {imagePreview && (
        <div
          style={{
            padding: "10px 16px",
            background: "#0c1525",
            borderTop: "1px solid rgba(34,211,238,0.08)",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <img
            src={imagePreview}
            alt="preview"
            style={{ height: "60px", borderRadius: "8px", objectFit: "cover" }}
          />
          <button
            onClick={() => setImagePreview(null)}
            style={{
              background: "rgba(239,68,68,0.2)",
              border: "1px solid rgba(239,68,68,0.4)",
              borderRadius: "8px",
              padding: "4px 10px",
              color: "#f87171",
              cursor: "pointer",
              fontSize: "0.8rem",
            }}
          >
            ✕ Remove
          </button>
        </div>
      )}

      {/* Emoji Picker */}
      {showEmoji && (
        <div
          style={{
            position: "absolute",
            bottom: "80px",
            left: "10px",
            zIndex: 100,
          }}
        >
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            theme="dark"
            height={380}
            width={320}
          />
        </div>
      )}

      {/* Input */}
      <form
        onSubmit={handleSend}
        style={{
          padding: "14px 16px",
          background: "#0c1525",
          borderTop: "1px solid rgba(34,211,238,0.08)",
          display: "flex",
          gap: "10px",
          alignItems: "center",
        }}
      >
        {/* Emoji Button */}
        <button
          type="button"
          onClick={() => setShowEmoji(!showEmoji)}
          style={{
            width: "38px",
            height: "38px",
            borderRadius: "50%",
            background: showEmoji ? "rgba(34,211,238,0.15)" : "transparent",
            border: "1.5px solid rgba(34,211,238,0.2)",
            cursor: "pointer",
            fontSize: "1.2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            transition: "all 0.2s ease",
          }}
        >
          😊
        </button>

        {/* Image Upload Button */}
        <button
          type="button"
          onClick={() => fileInputRef.current.click()}
          style={{
            width: "38px",
            height: "38px",
            borderRadius: "50%",
            background: imagePreview ? "rgba(34,211,238,0.15)" : "transparent",
            border: "1.5px solid rgba(34,211,238,0.2)",
            cursor: "pointer",
            fontSize: "1.1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            transition: "all 0.2s ease",
          }}
        >
          🖼️
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: "none" }}
        />

        {/* Text Input */}
        <input
          type="text"
          value={text}
          onChange={handleTyping}
          placeholder="Type a message..."
          style={{
            flex: 1,
            background: "#101d30",
            border: "1.5px solid rgba(34,211,238,0.15)",
            borderRadius: "14px",
            padding: "12px 16px",
            color: "#bde4f5",
            fontSize: "0.9rem",
            outline: "none",
            fontFamily: "'DM Sans', sans-serif",
            transition: "border-color 0.2s ease",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#22d3ee")}
          onBlur={(e) => (e.target.style.borderColor = "rgba(34,211,238,0.15)")}
        />

        {/* Send Button */}
        <button
          type="submit"
          disabled={sending || (!text.trim() && !imagePreview)}
          style={{
            width: "46px",
            height: "46px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #0369a1, #22d3ee)",
            border: "none",
            cursor:
              sending || (!text.trim() && !imagePreview)
                ? "not-allowed"
                : "pointer",
            opacity: sending || (!text.trim() && !imagePreview) ? 0.5 : 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.1rem",
            transition: "all 0.2s ease",
            flexShrink: 0,
            boxShadow: "0 4px 15px rgba(34,211,238,0.3)",
          }}
        >
          ➤
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;

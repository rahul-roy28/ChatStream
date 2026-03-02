import React, { useEffect, useState } from "react";
import axios from "../utils/axios.js";
import useChatStore from "../store/useChatStore";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const {
    currentUser,
    selectedUser,
    setSelectedUser,
    onlineUsers,
    unreadCounts,
    clearUnread,
    logout,
  } = useChatStore();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users");
        // Filter out current user
        const filtered = res.data.filter((u) => u._id !== currentUser._id);
        setUsers(filtered);
      } catch (err) {
        console.log("Error fetching users:", err);
      }
    };
    fetchUsers();
  }, [currentUser]);

  const filteredUsers = users.filter((u) =>
    u.username.toLowerCase().includes(search.toLowerCase()),
  );

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

  return (
    <div
      style={{
        width: "280px",
        minWidth: "280px",
        height: "100%",
        background: "#0c1525",
        borderRight: "1px solid rgba(34,211,238,0.08)",
        display: "flex",
        flexDirection: "column",
        // Full width on mobile
        ...(window.innerWidth <= 768
          ? { width: "100vw", minWidth: "100vw" }
          : {}),
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "20px 16px 12px",
          borderBottom: "1px solid rgba(34,211,238,0.08)",
        }}
      >
        <h2
          style={{
            fontFamily: "'Sora', sans-serif",
            fontSize: "1.3rem",
            fontWeight: "700",
            background: "linear-gradient(135deg, #0369a1, #22d3ee)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "12px",
          }}
        >
          ChatStream 🌊
        </h2>

        {/* Search */}
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            background: "#101d30",
            border: "1.5px solid rgba(34,211,238,0.15)",
            borderRadius: "12px",
            padding: "10px 14px",
            color: "#bde4f5",
            fontSize: "0.85rem",
            outline: "none",
            boxSizing: "border-box",
            fontFamily: "'DM Sans', sans-serif",
          }}
        />
      </div>

      {/* Online count */}
      <div
        style={{
          padding: "10px 16px",
          fontSize: "0.72rem",
          color: "#22d3ee",
          fontWeight: "600",
          letterSpacing: "0.05em",
          textTransform: "uppercase",
        }}
      >
        {onlineUsers.length} Online
      </div>

      {/* Users list */}
      <div style={{ flex: 1, overflowY: "auto", padding: "4px 8px" }}>
        {filteredUsers.length === 0 && (
          <p
            style={{
              color: "#1e4a5a",
              textAlign: "center",
              marginTop: "40px",
              fontSize: "0.85rem",
            }}
          >
            No users found
          </p>
        )}
        {filteredUsers.map((user) => {
          const isOnline = onlineUsers.includes(user._id);
          const isSelected = selectedUser?._id === user._id;

          return (
            <div
              key={user._id}
              onClick={() => {
                setSelectedUser(user);
                clearUnread(user._id);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "10px 10px",
                borderRadius: "14px",
                cursor: "pointer",
                marginBottom: "4px",
                background: isSelected ? "rgba(34,211,238,0.1)" : "transparent",
                border: isSelected
                  ? "1px solid rgba(34,211,238,0.2)"
                  : "1px solid transparent",
                transition: "all 0.2s ease",
              }}
            >
              {/* Avatar */}
              <div style={{ position: "relative", flexShrink: 0 }}>
                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "50%",
                    background: getAvatarColor(user.username),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "700",
                    fontSize: "0.8rem",
                    color: "white",
                    fontFamily: "'Sora', sans-serif",
                  }}
                >
                  {getInitials(user.username)}
                </div>
                {/* Online dot */}
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

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    color: "#bde4f5",
                    fontWeight: "600",
                    fontSize: "0.9rem",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {user.username}
                </div>
                <div
                  style={{
                    fontSize: "0.72rem",
                    color: isOnline ? "#22c55e" : "#4a6a7a",
                    marginTop: "2px",
                  }}
                >
                  {isOnline ? "● Online" : "○ Offline"}
                </div>
              </div>
              {/* Unread Badge */}
              {unreadCounts[user._id] > 0 && (
                <div
                  style={{
                    minWidth: "20px",
                    height: "20px",
                    borderRadius: "10px",
                    background: "linear-gradient(135deg, #0369a1, #22d3ee)",
                    color: "white",
                    fontSize: "0.65rem",
                    fontWeight: "700",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0 6px",
                    flexShrink: 0,
                    boxShadow: "0 2px 8px rgba(34,211,238,0.4)",
                    fontFamily: "'Sora', sans-serif",
                  }}
                >
                  {unreadCounts[user._id] > 99 ? "99+" : unreadCounts[user._id]}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Current user footer */}
      <div
        style={{
          padding: "12px 16px",
          borderTop: "1px solid rgba(34,211,238,0.08)",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        {/* Avatar */}
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            background: currentUser.profilePic
              ? "transparent"
              : getAvatarColor(currentUser.username),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "700",
            fontSize: "0.75rem",
            color: "white",
            fontFamily: "'Sora', sans-serif",
            flexShrink: 0,
            overflow: "hidden",
          }}
        >
          {currentUser.profilePic ? (
            <img
              src={currentUser.profilePic}
              alt="avatar"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            getInitials(currentUser.username)
          )}
        </div>

        {/* Name */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              color: "#bde4f5",
              fontWeight: "600",
              fontSize: "0.85rem",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {currentUser.username}
          </div>
          <div style={{ color: "#22c55e", fontSize: "0.7rem" }}>● Online</div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          title="Logout"
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.2)",
            color: "#f87171",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(239,68,68,0.25)";
            e.currentTarget.style.borderColor = "rgba(239,68,68,0.5)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(239,68,68,0.1)";
            e.currentTarget.style.borderColor = "rgba(239,68,68,0.2)";
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#f87171"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ transform: "scaleX(-1)" }}
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

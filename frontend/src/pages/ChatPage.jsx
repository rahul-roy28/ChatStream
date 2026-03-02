import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import useChatStore from "../store/useChatStore";

const ChatPage = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const showSidebar = !isMobile || !selectedUser;
  const showChat = !isMobile || selectedUser;

  const handleBack = () => {
    setSelectedUser(null);
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        fontFamily: "'DM Sans', sans-serif",
        background: "#080e1a",
      }}
    >
      {/* Sidebar */}
      {showSidebar && (
        <div
          style={{
            width: isMobile ? "100vw" : "280px",
            minWidth: isMobile ? "100vw" : "280px",
            height: "100%",
          }}
        >
          <Sidebar />
        </div>
      )}

      {/* Chat Window */}
      {showChat && (
        <div style={{ flex: 1, height: "100%", minWidth: 0 }}>
          <ChatWindow onBack={handleBack} />
        </div>
      )}
    </div>
  );
};

export default ChatPage;

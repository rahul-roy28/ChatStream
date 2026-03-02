import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import JoinPage from "./pages/JoinPage";
import ChatPage from "./pages/ChatPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import useChatStore from "./store/useChatStore";
import axios from "./utils/axios.js";

const App = () => {
  const { currentUser, token, setCurrentUser, logout } = useChatStore();

  // Auto login if token exists
  useEffect(() => {
    if (token && !currentUser) {
      axios
        .get("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setCurrentUser(res.data))
        .catch(() => logout());
    }
  }, []);

  return (
    <Routes>
      <Route
        path="/"
        element={!currentUser ? <LoginPage /> : <Navigate to="/chat" />}
      />
      <Route
        path="/login"
        element={!currentUser ? <LoginPage /> : <Navigate to="/chat" />}
      />
      <Route
        path="/register"
        element={!currentUser ? <RegisterPage /> : <Navigate to="/chat" />}
      />
      <Route
        path="/chat"
        element={currentUser ? <ChatPage /> : <Navigate to="/login" />}
      />
    </Routes>
  );
};

export default App;

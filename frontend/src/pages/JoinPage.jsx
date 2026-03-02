import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useChatStore from "../store/useChatStore";

const JoinPage = () => {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { setCurrentUser } = useChatStore();
  const navigate = useNavigate();

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setError("Please enter a username");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const res = await axios.post("http://localhost:5000/api/users/create", {
        username: username.trim(),
      });
      setCurrentUser(res.data);
      navigate("/chat");
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(to bottom, #22d3ee 0%, #0891b2 20%, #0369a1 45%, #03396b 70%, #01111f 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'DM Sans', sans-serif",
        overflow: "hidden",
        position: "relative",
        padding: "20px",
      }}
    >
      {/* Animated background blobs */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap');

        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-30px) scale(1.05); }
        }
        @keyframes floatReverse {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(30px) scale(0.95); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes ripple {
          0% { transform: scale(0.8); opacity: 1; }
          100% { transform: scale(2.5); opacity: 0; }
        }
        @keyframes particleFloat {
          0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-100px) rotate(720deg); opacity: 0; }
        }

        .join-card {
          animation: fadeSlideUp 0.8s ease forwards;
        }
        .join-logo {
          animation: fadeSlideUp 0.8s ease 0.1s both;
        }
        .join-subtitle {
          animation: fadeSlideUp 0.8s ease 0.2s both;
        }
        .join-form {
          animation: fadeSlideUp 0.8s ease 0.3s both;
        }
        .join-input:focus {
          border-color: #22d3ee !important;
          box-shadow: 0 0 0 3px rgba(34,211,238,0.15) !important;
        }
        .join-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(34,211,238,0.4) !important;
        }
        .join-btn:active {
          transform: translateY(0px);
        }
        .join-btn {
          transition: all 0.2s ease;
        }
        .blob1 {
          animation: float 8s ease-in-out infinite;
        }
        .blob2 {
          animation: floatReverse 10s ease-in-out infinite;
        }
        .blob3 {
          animation: float 12s ease-in-out infinite 2s;
        }
        .ripple-ring {
          animation: ripple 3s ease-out infinite;
        }
        .ripple-ring2 {
          animation: ripple 3s ease-out infinite 1s;
        }
        .ripple-ring3 {
          animation: ripple 3s ease-out infinite 2s;
        }
        .particle {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
        }
        .particle:nth-child(1) { animation: particleFloat 12s linear infinite 0s; left: 10%; width: 4px; height: 4px; background: #22d3ee; }
        .particle:nth-child(2) { animation: particleFloat 15s linear infinite 2s; left: 25%; width: 3px; height: 3px; background: #0369a1; }
        .particle:nth-child(3) { animation: particleFloat 10s linear infinite 4s; left: 40%; width: 5px; height: 5px; background: #22d3ee; opacity: 0.5; }
        .particle:nth-child(4) { animation: particleFloat 14s linear infinite 1s; left: 60%; width: 3px; height: 3px; background: #67e8f9; }
        .particle:nth-child(5) { animation: particleFloat 11s linear infinite 3s; left: 75%; width: 4px; height: 4px; background: #0369a1; }
        .particle:nth-child(6) { animation: particleFloat 13s linear infinite 5s; left: 88%; width: 3px; height: 3px; background: #22d3ee; opacity: 0.6; }
      `}</style>

      {/* Floating particles */}
      <div className="particle"></div>
      <div className="particle"></div>
      <div className="particle"></div>
      <div className="particle"></div>
      <div className="particle"></div>
      <div className="particle"></div>

      {/* Background blobs */}
      <div
        className="blob1"
        style={{
          position: "absolute",
          top: "-100px",
          left: "-100px",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(3,105,161,0.3) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        className="blob2"
        style={{
          position: "absolute",
          bottom: "-150px",
          right: "-100px",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(34,211,238,0.2) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        className="blob3"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "800px",
          height: "800px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(3,105,161,0.08) 0%, transparent 60%)",
          pointerEvents: "none",
        }}
      />

      {/* Card */}
      <div
        className="join-card"
        style={{
          background: "rgba(12, 21, 37, 0.85)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(34,211,238,0.15)",
          borderRadius: "24px",
          padding: "48px 40px",
          width: "100%",
          maxWidth: "420px",
          boxShadow:
            "0 25px 80px rgba(0,0,0,0.5), 0 0 60px rgba(34,211,238,0.05)",
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* Ripple effect behind logo */}
        <div
          style={{
            textAlign: "center",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "8px",
          }}
        >
          {/* Logo */}
          <div
            className="join-logo"
            style={{ position: "relative", zIndex: 2, textAlign: "center" }}
          >
            <h1
              style={{
                fontFamily: "'Sora', sans-serif",
                fontSize: "2.2rem",
                fontWeight: "700",
                background:
                  "linear-gradient(135deg, #0369a1, #22d3ee, #67e8f9)",
                backgroundSize: "200% auto",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              ChatStream 🌊
            </h1>
          </div>
        </div>

        {/* Subtitle */}
        <div
          className="join-subtitle"
          style={{ textAlign: "center", marginBottom: "36px" }}
        >
          <p style={{ color: "#4a8fa0", fontSize: "0.9rem" }}>
            Connect and chat in real-time
          </p>
        </div>

        {/* Form */}
        <form className="join-form" onSubmit={handleJoin}>
          <label
            style={{
              display: "block",
              color: "#7ecfdf",
              fontSize: "0.85rem",
              fontWeight: "600",
              marginBottom: "8px",
              letterSpacing: "0.03em",
            }}
          >
            Enter your username
          </label>

          <input
            className="join-input"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="e.g. Rahul"
            style={{
              width: "100%",
              background: "#101d30",
              border: "1.5px solid rgba(34,211,238,0.2)",
              borderRadius: "14px",
              padding: "14px 18px",
              color: "#bde4f5",
              fontSize: "0.95rem",
              outline: "none",
              marginBottom: "8px",
              transition: "all 0.2s ease",
              boxSizing: "border-box",
              fontFamily: "'DM Sans', sans-serif",
            }}
          />

          {error && (
            <p
              style={{
                color: "#f87171",
                fontSize: "0.8rem",
                marginBottom: "8px",
              }}
            >
              ⚠️ {error}
            </p>
          )}

          <button
            className="join-btn"
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              background: "linear-gradient(135deg, #0369a1, #22d3ee)",
              border: "none",
              borderRadius: "14px",
              padding: "14px",
              color: "white",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              marginTop: "8px",
              fontFamily: "'Sora', sans-serif",
              letterSpacing: "0.02em",
            }}
          >
            {loading ? "Joining..." : "Join ChatStream 🚀"}
          </button>
        </form>

        {/* Bottom hint */}
        <p
          style={{
            textAlign: "center",
            color: "#1e4a5a",
            fontSize: "0.75rem",
            marginTop: "24px",
          }}
        >
          No account needed · Just enter a name and chat!
        </p>
      </div>
    </div>
  );
};

export default JoinPage;

import React, { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../utils/axios.js";
import useChatStore from "../store/useChatStore";

const RegisterPage = () => {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { setCurrentUser, setToken } = useChatStore();
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePic(reader.result);
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.email || !form.password) {
      setError("All fields are required");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        ...form,
        profilePic: profilePic || "",
      });
      setToken(res.data.token);
      setCurrentUser(res.data.user);
      navigate("/chat");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
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
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap');
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes particleFloat {
          0% { transform: translateY(100vh); opacity: 0; }
          10% { opacity: 1; } 90% { opacity: 1; }
          100% { transform: translateY(-100px); opacity: 0; }
        }
        .auth-card { animation: fadeSlideUp 0.8s ease forwards; }
        .auth-input:focus {
          border-color: #22d3ee !important;
          box-shadow: 0 0 0 3px rgba(34,211,238,0.15) !important;
        }
        .auth-btn { transition: all 0.2s ease; }
        .auth-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(34,211,238,0.4) !important; }
        .particle { position: absolute; border-radius: 50%; pointer-events: none; }
        .particle:nth-child(1) { animation: particleFloat 12s linear infinite 0s; left: 10%; width: 4px; height: 4px; background: #22d3ee; }
        .particle:nth-child(2) { animation: particleFloat 15s linear infinite 2s; left: 25%; width: 3px; height: 3px; background: #67e8f9; }
        .particle:nth-child(3) { animation: particleFloat 10s linear infinite 4s; left: 60%; width: 5px; height: 5px; background: #22d3ee; opacity: 0.5; }
        .particle:nth-child(4) { animation: particleFloat 13s linear infinite 1s; left: 80%; width: 3px; height: 3px; background: #67e8f9; }
        .avatar-upload:hover { border-color: #22d3ee !important; }
      `}</style>

      <div className="particle"></div>
      <div className="particle"></div>
      <div className="particle"></div>
      <div className="particle"></div>

      <div
        className="auth-card"
        style={{
          background: "rgba(12, 21, 37, 0.85)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(34,211,238,0.15)",
          borderRadius: "24px",
          padding: "40px 36px",
          width: "100%",
          maxWidth: "440px",
          boxShadow: "0 25px 80px rgba(0,0,0,0.5)",
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <h1
            style={{
              fontFamily: "'Sora', sans-serif",
              fontSize: "2rem",
              fontWeight: "700",
              color: "#22d3ee",
              marginBottom: "4px",
            }}
          >
            ChatStream 🌊
          </h1>
          <p style={{ color: "#4a8fa0", fontSize: "0.88rem" }}>
            Create your account
          </p>
        </div>

        {/* Avatar Upload */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "24px",
          }}
        >
          <div
            className="avatar-upload"
            onClick={() => fileRef.current.click()}
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              border: "2px dashed rgba(34,211,238,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              overflow: "hidden",
              transition: "border-color 0.2s ease",
              background: preview ? "transparent" : "rgba(34,211,238,0.05)",
            }}
          >
            {preview ? (
              <img
                src={preview}
                alt="avatar"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "1.5rem" }}>📷</div>
                <div
                  style={{
                    color: "#4a8fa0",
                    fontSize: "0.6rem",
                    marginTop: "2px",
                  }}
                >
                  Photo
                </div>
              </div>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleImage}
            style={{ display: "none" }}
          />
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "14px" }}
        >
          {[
            { name: "username", placeholder: "Username", type: "text" },
            { name: "email", placeholder: "Email address", type: "email" },
            {
              name: "password",
              placeholder: "Password (min 6 characters)",
              type: "password",
            },
          ].map((field) => (
            <input
              key={field.name}
              className="auth-input"
              type={field.type}
              name={field.name}
              placeholder={field.placeholder}
              value={form[field.name]}
              onChange={handleChange}
              style={{
                background: "#101d30",
                border: "1.5px solid rgba(34,211,238,0.2)",
                borderRadius: "14px",
                padding: "13px 18px",
                color: "#bde4f5",
                fontSize: "0.9rem",
                outline: "none",
                fontFamily: "'DM Sans', sans-serif",
                transition: "all 0.2s ease",
              }}
            />
          ))}

          {error && (
            <p style={{ color: "#f87171", fontSize: "0.8rem" }}>⚠️ {error}</p>
          )}

          <button
            className="auth-btn"
            type="submit"
            disabled={loading}
            style={{
              background: "linear-gradient(135deg, #0369a1, #22d3ee)",
              border: "none",
              borderRadius: "14px",
              padding: "14px",
              color: "white",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              fontFamily: "'Sora', sans-serif",
              marginTop: "4px",
            }}
          >
            {loading ? "Creating account..." : "Create Account 🚀"}
          </button>
        </form>

        <p
          style={{
            textAlign: "center",
            color: "#4a8fa0",
            fontSize: "0.85rem",
            marginTop: "20px",
          }}
        >
          Already have an account?{" "}
          <Link
            to="/login"
            style={{
              color: "#22d3ee",
              textDecoration: "none",
              fontWeight: "600",
            }}
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;

// src/pages/adminlogin.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../firebase";

// import your background image
import schoolBg from "../assets/images/school-bg.webp";

const ALLOWED_ADMIN_EMAILS = [
  "peshmay@gmail.com",
  // "second.admin@example.com",
];

const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const userEmail = (cred.user.email ?? email).toLowerCase();

      // check if this email is allowed for admin
      if (!ALLOWED_ADMIN_EMAILS.map((e) => e.toLowerCase()).includes(userEmail)) {
        await signOut(auth); // immediately sign out
        setLoading(false);
        setError("You are not allowed to log in as admin.");
        return;
      }

      const idToken = await cred.user.getIdToken();

      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem("idToken", idToken);
      storage.setItem("userEmail", userEmail);

      // go to admin dashboard page
      navigate("/adminmenu");
    } catch (err: unknown) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "Admin login failed. Please check your email and password."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleForgotPassword(e: React.MouseEvent) {
    e.preventDefault();
    alert("Admin password reset is not implemented in this demo.");
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        // ⬇️ Same background style as student login
        backgroundImage: `linear-gradient(rgba(10, 25, 47, 0.85), rgba(10, 25, 47, 0.9)), url(${schoolBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        padding: "2rem",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 480,
          background: "rgba(255, 255, 255, 0.98)",
          borderRadius: 18,
          boxShadow: "0 24px 80px rgba(0, 0, 0, 0.35)",
          padding: "2.5rem 3rem",
          border: "1px solid rgba(255,255,255,0.8)",
          backdropFilter: "blur(12px)",
        }}
      >
        <h1
          style={{
            fontSize: "1.9rem",
            marginBottom: 4,
            fontWeight: 700,
            color: "#111827",
          }}
        >
          Admin Login
        </h1>
        <p style={{ marginBottom: 24, color: "#4b5563", fontSize: 14 }}>
          Log in to manage students and grades.
        </p>

        {error && (
          <div
            style={{
              marginBottom: 14,
              padding: "0.6rem 0.85rem",
              borderRadius: 8,
              background: "#fef2f2",
              color: "#b91c1c",
              fontSize: 13,
              border: "1px solid #fecaca",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label
            style={{
              display: "block",
              fontSize: 13,
              marginBottom: 4,
              fontWeight: 600,
              color: "#374151",
            }}
          >
            📧 E-mail
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "0.65rem 0.85rem",
              borderRadius: 10,
              border: "1px solid #e5e7eb",
              marginBottom: 16,
              fontSize: 14,
              outline: "none",
              transition: "box-shadow 0.15s ease, border-color 0.15s ease",
              boxShadow: "0 1px 2px rgba(15,23,42,0.04)",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#2563eb";
              e.target.style.boxShadow = "0 0 0 1px rgba(37,99,235,0.25)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#e5e7eb";
              e.target.style.boxShadow = "0 1px 2px rgba(15,23,42,0.04)";
            }}
          />

          <label
            style={{
              display: "block",
              fontSize: 13,
              marginBottom: 4,
              fontWeight: 600,
              color: "#374151",
            }}
          >
            🔒 Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "0.65rem 0.85rem",
              borderRadius: 10,
              border: "1px solid #e5e7eb",
              marginBottom: 10,
              fontSize: 14,
              outline: "none",
              transition: "box-shadow 0.15s ease, border-color 0.15s ease",
              boxShadow: "0 1px 2px rgba(15,23,42,0.04)",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#2563eb";
              e.target.style.boxShadow = "0 0 0 1px rgba(37,99,235,0.25)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#e5e7eb";
              e.target.style.boxShadow = "0 1px 2px rgba(15,23,42,0.04)";
            }}
          />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 16,
              fontSize: 13,
              color: "#4b5563",
            }}
          >
            <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ cursor: "pointer" }}
              />
              <span>Remember me</span>
            </label>

            <button
              type="button"
              onClick={handleForgotPassword}
              style={{
                border: "none",
                background: "none",
                color: "#2563eb",
                cursor: "pointer",
                fontSize: 13,
                padding: 0,
                fontWeight: 500,
              }}
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "0.7rem",
              borderRadius: 999,
              border: "none",
              background: loading
                ? "linear-gradient(135deg, #60a5fa, #4f46e5)"
                : "linear-gradient(135deg, #2563eb, #4f46e5)",
              color: "#fff",
              fontWeight: 600,
              fontSize: 15,
              cursor: loading ? "default" : "pointer",
              opacity: loading ? 0.8 : 1,
              marginBottom: 12,
              boxShadow: "0 12px 28px rgba(37, 99, 235, 0.35)",
              transition: "transform 0.1s ease, box-shadow 0.1s ease",
            }}
            onMouseDown={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform =
                "translateY(1px)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "0 6px 16px rgba(37, 99, 235, 0.35)";
            }}
            onMouseUp={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform =
                "translateY(0)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "0 12px 28px rgba(37, 99, 235, 0.35)";
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div
          style={{
            marginTop: 10,
            fontSize: 13,
            textAlign: "right",
            borderTop: "1px solid #e5e7eb",
            paddingTop: 10,
          }}
        >
          <button
            type="button"
            onClick={() => navigate("/loginpage")}
            style={{
              border: "none",
              background: "none",
              cursor: "pointer",
              fontSize: 13,
              color: "#2563eb",
              fontWeight: 500,
            }}
          >
            Back to student login
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;

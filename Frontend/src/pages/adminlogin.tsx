// src/pages/adminlogin.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, signOut } from "firebase/auth"; // 👈 added signOut
import { auth } from "../firebase";

//only these emails are allowed to use the admin login
const ALLOWED_ADMIN_EMAILS = [
  "peshmay@gmail.com",         // put your real admin email(s) here
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

      // ❗ check if this email is allowed for admin
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
        background: "#f4f4f4",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <div
        style={{
          width: 480,
          maxWidth: "90%",
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 22px 60px rgba(15,15,15,0.15)",
          padding: "2.5rem 3rem",
        }}
      >
        <h1 style={{ fontSize: "1.8rem", marginBottom: 4 }}>Admin Login</h1>
        <p style={{ marginBottom: 24, color: "#555" }}>
          Log in to manage students and grades.
        </p>

        {error && (
          <div
            style={{
              marginBottom: 12,
              padding: "0.5rem 0.75rem",
              borderRadius: 6,
              background: "#ffe5e5",
              color: "#a30000",
              fontSize: 13,
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
              fontWeight: 500,
            }}
          >
            E-mail
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "0.55rem 0.75rem",
              borderRadius: 8,
              border: "1px solid #ddd",
              marginBottom: 16,
              fontSize: 14,
            }}
          />

          <label
            style={{
              display: "block",
              fontSize: 13,
              marginBottom: 4,
              fontWeight: 500,
            }}
          >
            Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "0.55rem 0.75rem",
              borderRadius: 8,
              border: "1px solid #ddd",
              marginBottom: 8,
              fontSize: 14,
            }}
          />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 16,
              fontSize: 13,
            }}
          >
            <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Remember me</span>
            </label>

            <button
              type="button"
              onClick={handleForgotPassword}
              style={{
                border: "none",
                background: "none",
                color: "#0070f3",
                cursor: "pointer",
                fontSize: 13,
                padding: 0,
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
              padding: "0.65rem",
              borderRadius: 999,
              border: "none",
              background: "#0070f3",
              color: "#fff",
              fontWeight: 600,
              fontSize: 15,
              cursor: loading ? "default" : "pointer",
              opacity: loading ? 0.7 : 1,
              marginBottom: 16,
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div
          style={{
            marginTop: 8,
            fontSize: 13,
            textAlign: "right",
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
              color: "#0070f3",
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

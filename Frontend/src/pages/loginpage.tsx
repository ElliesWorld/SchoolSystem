// src/pages/loginpage.tsx
import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { useNavigate } from "react-router-dom";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isAdminSelected, setIsAdminSelected] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLoginEmail(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await cred.user.getIdToken();

      if (rememberMe) {
        localStorage.setItem("idToken", idToken);
        localStorage.setItem("userEmail", cred.user.email ?? email);
      } else {
        sessionStorage.setItem("idToken", idToken);
        sessionStorage.setItem("userEmail", cred.user.email ?? email);
      }

      // For now: route by admin toggle.
      // Later you can call backend to get role and use real role.
      if (isAdminSelected) {
        navigate("/admin");
      } else {
        navigate("/grades");
      }
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleLoginGoogle() {
    setError(null);
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      const email = result.user.email ?? "";

      if (rememberMe) {
        localStorage.setItem("idToken", idToken);
        localStorage.setItem("userEmail", email);
      } else {
        sessionStorage.setItem("idToken", idToken);
        sessionStorage.setItem("userEmail", email);
      }

      if (isAdminSelected) {
        navigate("/admin");
      } else {
        navigate("/grades");
      }
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Google login failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword() {
    if (!email) {
      setError("Enter your email above first, then click Forgot password.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent.");
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to send reset email");
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f5f5",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          background: "#fff",
          padding: "2rem",
          borderRadius: 12,
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        <h1 style={{ marginBottom: 8, fontSize: "1.5rem" }}>School System</h1>
        <p style={{ marginBottom: 16, color: "#555" }}>Login to view grades.</p>

        <form onSubmit={handleLoginEmail}>
          <label style={{ display: "block", marginBottom: 12, fontSize: 14 }}>
            E-mail
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                marginTop: 4,
                padding: "0.5rem 0.75rem",
                borderRadius: 8,
                border: "1px solid #ccc",
              }}
            />
          </label>

          <label style={{ display: "block", marginBottom: 8, fontSize: 14 }}>
            Password
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                marginTop: 4,
                padding: "0.5rem 0.75rem",
                borderRadius: 8,
                border: "1px solid #ccc",
              }}
            />
          </label>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
              fontSize: 13,
            }}
          >
            <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember me
            </label>

            <button
              type="button"
              onClick={handleForgotPassword}
              style={{
                border: "none",
                background: "none",
                color: "#0070f3",
                cursor: "pointer",
                padding: 0,
                fontSize: 13,
              }}
            >
              Forgot password?
            </button>
          </div>

          {error && (
            <div style={{ marginBottom: 12, color: "#b00020", fontSize: 13 }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "0.6rem 1rem",
              borderRadius: 999,
              border: "none",
              background: "#0070f3",
              color: "#fff",
              fontWeight: 600,
              cursor: loading ? "wait" : "pointer",
              marginBottom: 8,
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <button
            type="button"
            onClick={handleLoginGoogle}
            disabled={loading}
            style={{
              width: "100%",
              padding: "0.6rem 1rem",
              borderRadius: 999,
              border: "1px solid #ccc",
              background: "#fff",
              color: "#333",
              fontWeight: 500,
              cursor: loading ? "wait" : "pointer",
            }}
          >
            {loading ? "Logging in..." : "Login with Google"}
          </button>
        </form>

        {/* ADMIN option at bottom */}
        <div
          style={{
            marginTop: 16,
            paddingTop: 12,
            borderTop: "1px solid #eee",
            fontSize: 13,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>Are you an admin?</span>
          <label
            style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}
          >
            <input
              type="checkbox"
              checked={isAdminSelected}
              onChange={(e) => setIsAdminSelected(e.target.checked)}
            />
            ADMIN
          </label>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

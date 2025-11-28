// src/pages/loginpage.tsx
import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth, googleProvider } from "../firebase";
import { FcGoogle } from "react-icons/fc";
import schoolBg from "../assets/images/school-bg.webp";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  // ✅ Verify student role with backend using token + email
  async function verifyStudent(idToken: string, email: string) {
    const response = await fetch(`${API_BASE_URL}/api/auth/verify-student`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      console.error("verify-student failed:", body);
      throw new Error(body.error || "Not authorized as student");
    }
  }

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLoginEmail(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await cred.user.getIdToken();
      const userEmail = cred.user.email ?? email;

      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem("idToken", idToken);
      storage.setItem("userEmail", userEmail);

      // ✅ Verify student role
      await verifyStudent(idToken, userEmail);

      // Student always goes to grades
      navigate("/grades");
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
      const userEmail = result.user.email ?? "";

      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem("idToken", idToken);
      storage.setItem("userEmail", userEmail);

      // ✅ Verify student role
      await verifyStudent(idToken, userEmail);

      navigate("/grades");
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Google login failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword() {
    if (!email) {
      setError("Enter your email first, then click Forgot password.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent.");
    } catch (err: unknown) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "Failed to send reset email"
      );
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
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
          padding: "2.5rem 3rem",
          borderRadius: 18,
          boxShadow: "0 24px 80px rgba(0, 0, 0, 0.35)",
          border: "1px solid rgba(255,255,255,0.8)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div style={{ marginBottom: 24 }}>
          <h1
            style={{
              marginBottom: 4,
              fontSize: "1.9rem",
              fontWeight: 700,
              color: "#111827",
            }}
          >
            School System
          </h1>
          <p style={{ marginBottom: 0, color: "#4b5563", fontSize: 14 }}>
            Login to view grades and class information.
          </p>
        </div>

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

        <form onSubmit={handleLoginEmail}>
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
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 14,
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
                padding: 0,
                fontSize: 13,
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
              marginBottom: 10,
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

          {/* GOOGLE BUTTON */}
          <button
            type="button"
            onClick={handleLoginGoogle}
            disabled={loading}
            style={{
              width: "100%",
              padding: "0.7rem",
              borderRadius: 999,
              border: "1px solid #4b5563",
              background: "#374151",
              color: "#f9fafb",
              fontWeight: 500,
              fontSize: 14,
              cursor: loading ? "default" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              boxShadow: "0 2px 8px rgba(15,23,42,0.4)",
              transition:
                "background 0.15s ease, box-shadow 0.15s ease, transform 0.1s ease",
              marginTop: 6,
            }}
            onMouseOver={(e) => {
              if (loading) return;
              e.currentTarget.style.background = "#4b5563";
              e.currentTarget.style.boxShadow =
                "0 4px 12px rgba(15,23,42,0.45)";
            }}
            onMouseOut={(e) => {
              if (loading) return;
              e.currentTarget.style.background = "#374151";
              e.currentTarget.style.boxShadow =
                "0 2px 8px rgba(15,23,42,0.4)";
            }}
          >
            <FcGoogle style={{ width: 20, height: 20 }} />
            <span>{loading ? "Logging in..." : "Continue with Google"}</span>
          </button>
        </form>

        {/* Bottom row with admin link */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 20,
            fontSize: 13,
            color: "#6b7280",
            borderTop: "1px solid #e5e7eb",
            paddingTop: 12,
          }}
        >
          <span>Are you an admin?</span>
          <button
            type="button"
            onClick={() => navigate("/adminlogin")}
            style={{
              border: "none",
              background: "none",
              cursor: "pointer",
              color: "#f97316",
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: 0.5,
            }}
          >
            ADMIN
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

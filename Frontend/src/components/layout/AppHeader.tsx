// src/components/layout/AppHeader.tsx
import React from "react";
import { useNavigate } from "react-router-dom";

interface AppHeaderProps {
  title: string;
  userEmail?: string;
  onLogout?: () => void;
  showBackButton?: boolean;
  backRoute?: string;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  userEmail,
  onLogout,
  showBackButton = false,
  backRoute,
}) => {
  const navigate = useNavigate();

  // subtitle styling you mentioned (13px, grey, marginTop: 2)
  const subtitleText =
    title === "Admin" ? "Admin dashboard" : "School System";

  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0.9rem 2rem",
        background: "#ffffff",
        boxShadow: "0 2px 10px rgba(15,23,42,0.06)",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      {/* LEFT: back button (optional) + logo + title + small subtitle */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {showBackButton && (
          <button
            onClick={() => (backRoute ? navigate(backRoute) : navigate(-1))}
            style={{
              border: "none",
              background: "none",
              fontSize: "1.3rem",
              cursor: "pointer",
            }}
            title="Back"
          >
            ←
          </button>
        )}

        {/* school logo */}
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 16,
            background:
              "linear-gradient(135deg, #f97316, #ec4899, #6366f1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
            color: "#ffffff",
            boxShadow: "0 8px 20px rgba(15,23,42,0.35)",
          }}
        >
          🏫
        </div>

        {/* title + small grey line under it */}
        <div>
          <div
            style={{
              fontSize: 24,          // 👈 your requested big Admin style
              fontWeight: 700,
              color: "#111827",
              lineHeight: 1.1,
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 13,          // 👈 your requested small text style
              color: "#6b7280",
              marginTop: 2,
            }}
          >
            {subtitleText}
          </div>
        </div>
      </div>

      {/* RIGHT: email + Logout */}
      {(userEmail || onLogout) && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 14,
          }}
        >
          {userEmail && (
            <div style={{ color: "#4b5563" }}>{userEmail}</div>
          )}

          {onLogout && (
            <button
              onClick={onLogout}
              style={{
                borderRadius: 999,
                border: "1px solid #d1d5db",
                background: "#ffffff",
                padding: "0.3rem 1.1rem",
                fontSize: 13,
                fontWeight: 500,
                color: "#374151",
                cursor: "pointer",
                boxShadow: "0 4px 10px rgba(15,23,42,0.08)",
              }}
            >
              Logout
            </button>
          )}
        </div>
      )}
    </header>
  );
};

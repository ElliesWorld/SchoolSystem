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

  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem 2rem",
        background: "#fff",
        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {showBackButton && (
          <button
            onClick={() => navigate(backRoute || -1)}
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
        <span style={{ fontSize: "1.3rem", fontWeight: 600 }}>{title}</span>
      </div>

      {(userEmail || onLogout) && (
        <div style={{ textAlign: "right", fontSize: 14 }}>
          {userEmail && <div>{userEmail}</div>}
          {onLogout && (
            <button
              onClick={onLogout}
              style={{
                border: "none",
                background: "none",
                color: "#0070f3",
                cursor: "pointer",
                fontSize: 13,
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
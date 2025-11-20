// src/pages/adminmenu.tsx
import React from "react";
import { useNavigate } from "react-router-dom";

const AdminMenuPage: React.FC = () => {
  const navigate = useNavigate();

  const storage = localStorage.getItem("idToken") ? localStorage : sessionStorage;
  const userEmail = storage.getItem("userEmail") ?? "";

  function handleLogout() {
    localStorage.removeItem("idToken");
    localStorage.removeItem("userEmail");
    sessionStorage.removeItem("idToken");
    sessionStorage.removeItem("userEmail");
    navigate("/loginpage");
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f4f4",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Top bar */}
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
        <div style={{ fontSize: "1.3rem", fontWeight: 600 }}>Admin</div>
        <div style={{ textAlign: "right", fontSize: 14 }}>
          <div>{userEmail || "Admin"}</div>
          <button
            onClick={handleLogout}
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
        </div>
      </header>

      {/* Center content */}
      <main
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: 400,
            maxWidth: "90%",
            display: "flex",
            flexDirection: "column",
            gap: 24,
          }}
        >
          <button
            type="button"
            onClick={() => navigate("/adminregistergrades")}
            style={{
              width: "100%",
              padding: "1rem",
              borderRadius: 12,
              border: "1px solid #ccc",
              background: "#fff",
              fontSize: 20,
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
            }}
          >
            Register Grades
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin")}
            style={{
              width: "100%",
              padding: "1rem",
              borderRadius: 12,
              border: "1px solid #ccc",
              background: "#fff",
              fontSize: 20,
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
            }}
          >
            Admin Student Accounts
          </button>
        </div>
      </main>
    </div>
  );
};

export default AdminMenuPage;

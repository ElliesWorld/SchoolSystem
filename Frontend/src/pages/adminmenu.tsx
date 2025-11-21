// src/pages/adminmenu.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { PageContainer, AppHeader } from "../components/layout";
import { useAuth } from "../hooks/useAuth";
import { ROUTES } from "../constants";

const AdminMenuPage: React.FC = () => {
  const navigate = useNavigate();
  const { userEmail, logout } = useAuth();

  const menuItems = [
    {
      label: "Register Grades",
      onClick: () => navigate(ROUTES.ADMIN_REGISTER_GRADES),
    },
    {
      label: "Admin Student Accounts",
      onClick: () => navigate(ROUTES.ADMIN_STUDENTS),
    },
  ];

  return (
    <PageContainer>
      <AppHeader title="Admin" userEmail={userEmail || "Admin"} onLogout={logout} />

      <main
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "calc(100vh - 70px)",
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
          {menuItems.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={item.onClick}
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
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.1)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.05)";
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </main>
    </PageContainer>
  );
};

export default AdminMenuPage;
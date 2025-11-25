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
      icon: "📊",
    },
    {
      label: "Admin Student Accounts",
      onClick: () => navigate(ROUTES.ADMIN_STUDENTS),
      icon: "👥",
    },
  ];

  return (
    <PageContainer>
      {/* outer header: logo + Admin + email + Logout */}
      <AppHeader
        title="Admin"
        userEmail={userEmail || "Admin"}
        onLogout={logout}
      />

      <main
        style={{
          flex: 1,
          minHeight: "calc(100vh - 70px)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(#E0F2FE, #F9FAFB)", // soft off-white
          padding: "2rem 1rem",
        }}
      >
        {/* main card (no inner header/email/logout) */}
        <div
          style={{
            width: "100%",
            maxWidth: 720,
            background: "#ffffff",
            borderRadius: 32,
            boxShadow: "0 24px 60px rgba(15, 23, 42, 0.18)",
            padding: "2.5rem 3rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* buttons area, centered */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 24,
            }}
          >
            {menuItems.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={item.onClick}
                style={{
                  minWidth: 230,
                  padding: "1rem 1.6rem",
                  borderRadius: 999,
                  border: "none",
                  background:
                    item.label === "Register Grades"
                      ? "linear-gradient(135deg, #f97316, #fb7185)"
                      : "linear-gradient(135deg, #e5e7eb, #f9fafb)",
                  color:
                    item.label === "Register Grades" ? "#ffffff" : "#111827",
                  fontSize: 16,
                  fontWeight: 600,
                  cursor: "pointer",
                  boxShadow:
                    "0 14px 35px rgba(15, 23, 42, 0.18), 0 0 0 1px rgba(255,255,255,0.4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  transition: "transform 0.15s ease, box-shadow 0.15s ease",
                  textAlign: "center",
                  whiteSpace: "normal",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 18px 40px rgba(15, 23, 42, 0.25)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 14px 35px rgba(15, 23, 42, 0.18), 0 0 0 1px rgba(255,255,255,0.4)";
                }}
              >
                <span style={{ fontSize: 20 }}>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </main>
    </PageContainer>
  );
};

export default AdminMenuPage;

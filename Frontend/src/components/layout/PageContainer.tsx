// src/components/layout/PageContainer.tsx
import React from "react";

interface PageContainerProps {
  children: React.ReactNode;
}

export const PageContainer: React.FC<PageContainerProps> = ({ children }) => {
  return (
    <div style={{ minHeight: "100vh", background: "#f4f4f4" }}>
      {children}
    </div>
  );
};

export const PageMain: React.FC<PageContainerProps> = ({ children }) => {
  return <main style={{ padding: "1.5rem 2rem" }}>{children}</main>;
};
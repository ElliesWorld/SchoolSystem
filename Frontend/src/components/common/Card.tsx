// src/components/common/Card.tsx
import React from "react";

interface CardProps {
  children: React.ReactNode;
  title?: string;
  actions?: React.ReactNode;
  style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  title, 
  actions,
  style 
}) => {
  return (
    <div
      style={{
        background: "#fff",
        padding: "1rem",
        borderRadius: 12,
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        ...style,
      }}
    >
      {(title || actions) && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          {title && <h2 style={{ fontSize: "1.1rem" }}>{title}</h2>}
          {actions && <div>{actions}</div>}
        </div>
      )}
      {children}
    </div>
  );
};
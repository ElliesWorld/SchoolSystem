// src/components/common/Input.tsx
import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ 
  label, 
  error, 
  style,
  ...props 
}) => {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && (
        <label
          style={{
            display: "block",
            fontSize: 13,
            marginBottom: 4,
            fontWeight: 500,
          }}
        >
          {label}
        </label>
      )}
      <input
        style={{
          width: "100%",
          padding: "0.55rem 0.75rem",
          borderRadius: 8,
          border: error ? "1px solid #b00020" : "1px solid #ddd",
          fontSize: 14,
          ...style,
        }}
        {...props}
      />
      {error && (
        <div style={{ marginTop: 4, fontSize: 12, color: "#b00020" }}>
          {error}
        </div>
      )}
    </div>
  );
};
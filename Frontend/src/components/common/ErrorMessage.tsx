// src/components/common/ErrorMessage.tsx
import React from "react";

interface ErrorMessageProps {
  message: string | null;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div
      style={{
        marginBottom: 12,
        padding: "0.5rem 0.75rem",
        borderRadius: 6,
        background: "#ffe5e5",
        color: "#a30000",
        fontSize: 13,
      }}
    >
      {message}
    </div>
  );
};
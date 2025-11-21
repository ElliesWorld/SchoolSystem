// src/components/common/Button.tsx
import React from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    background: "#0070f3",
    color: "#fff",
    border: "none",
  },
  secondary: {
    background: "#fff",
    color: "#333",
    border: "1px solid #ccc",
  },
  danger: {
    background: "#fff",
    color: "#b00020",
    border: "1px solid #b00020",
  },
  ghost: {
    background: "none",
    color: "#0070f3",
    border: "none",
  },
};

const sizeStyles: Record<ButtonSize, React.CSSProperties> = {
  sm: {
    padding: "0.2rem 0.6rem",
    fontSize: 12,
  },
  md: {
    padding: "0.35rem 0.8rem",
    fontSize: 13,
  },
  lg: {
    padding: "0.65rem 1rem",
    fontSize: 15,
  },
};

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  disabled,
  children,
  style,
  ...props
}) => {
  return (
    <button
      disabled={disabled || loading}
      style={{
        borderRadius: 999,
        fontWeight: 600,
        cursor: disabled || loading ? "not-allowed" : "pointer",
        opacity: disabled || loading ? 0.7 : 1,
        width: fullWidth ? "100%" : "auto",
        ...variantStyles[variant],
        ...sizeStyles[size],
        ...style,
      }}
      {...props}
    >
      {loading ? "Loading..." : children}
    </button>
  );
};
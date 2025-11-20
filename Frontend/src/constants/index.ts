// src/constants/index.ts

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000";

export const ALLOWED_ADMIN_EMAILS = [
  "peshmay@gmail.com",
  // Add more admin emails here
];

export const GRADES = ["A", "B", "C", "D", "E", "F"] as const;

export const YEARS = [1, 2, 3] as const;

export const ROUTES = {
  LOGIN: "/loginpage",
  GRADES: "/grades",
  ADMIN_LOGIN: "/adminlogin",
  ADMIN_MENU: "/adminmenu",
  ADMIN_STUDENTS: "/admin",
  ADMIN_REGISTER_GRADES: "/adminregistergrades",
} as const;
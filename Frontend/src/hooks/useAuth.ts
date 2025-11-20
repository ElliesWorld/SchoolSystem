// src/hooks/useAuth.ts
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

type AuthStorage = {
  idToken: string | null;
  userEmail: string | null;
};

export const useAuth = () => {
  const navigate = useNavigate();
  const [auth, setAuth] = useState<AuthStorage>({
    idToken: null,
    userEmail: null,
  });

  useEffect(() => {
    // Check both localStorage and sessionStorage
    const storage = localStorage.getItem("idToken") ? localStorage : sessionStorage;
    setAuth({
      idToken: storage.getItem("idToken"),
      userEmail: storage.getItem("userEmail"),
    });
  }, []);

  const logout = () => {
    localStorage.removeItem("idToken");
    localStorage.removeItem("userEmail");
    sessionStorage.removeItem("idToken");
    sessionStorage.removeItem("userEmail");
    navigate("/loginpage");
  };

  const login = (idToken: string, userEmail: string, rememberMe: boolean) => {
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem("idToken", idToken);
    storage.setItem("userEmail", userEmail);
    setAuth({ idToken, userEmail });
  };

  return {
    ...auth,
    logout,
    login,
    isAuthenticated: !!auth.idToken,
  };
};

export const getAuthHeaders = (): HeadersInit => {
  const storage = localStorage.getItem("idToken") ? localStorage : sessionStorage;
  const idToken = storage.getItem("idToken");
  return idToken ? { Authorization: `Bearer ${idToken}` } : {};
};
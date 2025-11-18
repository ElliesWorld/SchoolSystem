// src/App.tsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/loginpage";
import GradesPage from "./pages/gradespage";
import AdminPage from "./pages/adminpage";
import AdminRegisterGradesPage from "./pages/adminregistergrades";
import AdminLoginPage from "./pages/adminlogin";

const App: React.FC = () => {
  return (
    <BrowserRouter>
    
<Routes>
  <Route path="/loginpage" element={<LoginPage />} />
  <Route path="/grades" element={<GradesPage />} />
  <Route path="/adminlogin" element={<AdminLoginPage />} />
  <Route path="/admin" element={<AdminPage />} />
  <Route
    path="/adminregistergrades"
    element={<AdminRegisterGradesPage />}
  />
  <Route path="*" element={<Navigate to="/loginpage" replace />} />
</Routes>
    </BrowserRouter>
  );
};

export default App;

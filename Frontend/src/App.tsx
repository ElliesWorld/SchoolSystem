import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/loginpage";
import GradesPage from "./pages/gradespage";
import AdminPage from "./pages/adminpage";
import AdminRegisterGradesPage from "./pages/adminregistergrades";
import AdminLoginPage from "./pages/adminlogin";
import AdminMenuPage from "./pages/adminmenu";   //new import

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/loginpage" element={<LoginPage />} />
        <Route path="/grades" element={<GradesPage />} />

        {/* admin-login screen */}
        <Route path="/adminlogin" element={<AdminLoginPage />} />

        {/* NEW: Admin menu page (wireframe with two big buttons) */}
        <Route path="/adminmenu" element={<AdminMenuPage />} />

        {/* existing admin pages stay the same */}
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

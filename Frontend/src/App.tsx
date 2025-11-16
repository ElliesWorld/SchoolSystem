// src/App.tsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/loginpage";
import GradesPage from "./pages/gradespage";
import AdminPage from "./pages/adminpage";
import AdminRegisterGradesPage from "./pages/adminregistergrades";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/loginpage" element={<LoginPage />} />
        <Route path="/grades" element={<GradesPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route
          path="/adminregistergrades"
          element={<AdminRegisterGradesPage />}
        />
        {/* default route */}
        <Route path="*" element={<Navigate to="/loginpage" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

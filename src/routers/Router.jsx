import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "@/pages/loginPage/LoginPage.jsx";
import SignupPage from "@/pages/signupPage/SignupPage.jsx";
import BoardPage from "@/pages/boardPage/BoardPage.jsx";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/boards" element={<BoardPage />} />
      </Routes>
    </BrowserRouter>
  );
}
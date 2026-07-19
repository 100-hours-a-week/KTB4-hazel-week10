import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import LoginPage from "../pages/loginPage/index.jsx";
import SignupPage from "../pages/signupPage/index.jsx";

import BoardPage from "../pages/boardPage/index.jsx";
import BoardWritePage from "../pages/postWritePage/index.jsx";
import BoardDetailPage from "../pages/boardDetailPage/index.jsx";
import BoardEditPage from "../pages/boardEditPage/index.jsx";

import UserEditPage from "../pages/userEditPage/index.jsx";
import PasswordEditPage from "../pages/passwordEditPage/index.jsx";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        <Route path="/boards" element={<BoardPage />} />
        <Route path="/boards/write" element={<BoardWritePage />} />
        <Route path="/boards/:postId" element={<BoardDetailPage />} />
        <Route path="/boards/:postId/edit" element={<BoardEditPage />} />

        <Route path="/users/edit" element={<UserEditPage />} />
        <Route path="/users/password" element={<PasswordEditPage />} />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
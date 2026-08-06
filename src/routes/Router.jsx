import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

const LoginPage = lazy(() => import("@/pages/loginPage/index.jsx"));
const SignupPage = lazy(() => import("@/pages/signupPage/index.jsx"));

const BoardPage = lazy(() => import("@/pages/boardPage/index.jsx"));
const BoardWritePage = lazy(() => import("@/pages/postWritePage/index.jsx"));
const BoardDetailPage = lazy(() => import("@/pages/boardDetailPage/index.jsx"));
const BoardEditPage = lazy(() => import("@/pages/boardEditPage/index.jsx"));
const SelectedBoardPage = lazy(() => import("@/pages/selectedBoardPage/index.jsx"));

const UserEditPage = lazy(() => import("@/pages/userEditPage/index.jsx"));
const PasswordEditPage = lazy(() => import("@/pages/passwordEditPage/index.jsx"));
const NotificationSettingsPage = lazy(() => import("@/pages/notificationSettingsPage/index.jsx"));
const DiscordCallbackPage = lazy(() => import("@/pages/discordCallbackPage/index.jsx"));

export default function Router() {
  return (
    <BrowserRouter>
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          <Route path="/boards" element={<BoardPage />} />
          <Route path="/boards/write" element={<BoardWritePage />} />
          <Route path="/boards/selected" element={<SelectedBoardPage />} />
          <Route path="/boards/:postId" element={<BoardDetailPage />} />
          <Route path="/boards/:postId/edit" element={<BoardEditPage />} />

          <Route path="/users/edit" element={<UserEditPage />} />
          <Route path="/users/password" element={<PasswordEditPage />} />
          <Route path="/users/notifications" element={<NotificationSettingsPage />} />
          <Route path="/auth/discord/callback" element={<DiscordCallbackPage />} />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

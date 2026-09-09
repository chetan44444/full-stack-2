import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Posts from "./pages/Posts";
import AdminUsers from "./pages/AdminUsers";
import AdminSettings from "./pages/AdminSettings";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";

export default function App() {
  const { isAuthenticated, initializing } = useAuth();

  return (
    <div className="app">
      <Navbar />

      <Routes>
        <Route
          path="/login"
          element={
            initializing ? (
              <div className="page-loading">Checking session...</div>
            ) : isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Login />
            )
          }
        />

        {/* Any authenticated user (Admin, Editor, Viewer) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Requires the "posts:view" permission — all three roles have it here,
            but changing ROLE_PERMISSIONS in one file changes this instantly */}
        <Route
          path="/posts"
          element={
            <ProtectedRoute permissions={["posts:view"]}>
              <Posts />
            </ProtectedRoute>
          }
        />

        {/* Admin-only routes, guarded by role */}
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute roles={["Admin"]}>
              <AdminUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute roles={["Admin"]}>
              <AdminSettings />
            </ProtectedRoute>
          }
        />

        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route
          path="/"
          element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />}
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

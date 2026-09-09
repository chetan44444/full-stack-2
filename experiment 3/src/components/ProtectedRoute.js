import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Wrap any route element with <ProtectedRoute> to guard it.
 *
 * Usage:
 *   <ProtectedRoute><Dashboard /></ProtectedRoute>
 *     -> just requires the user to be logged in
 *
 *   <ProtectedRoute roles={["Admin"]}><AdminPanel /></ProtectedRoute>
 *     -> requires login AND role to be one of the given roles
 *
 *   <ProtectedRoute permissions={["posts:delete"]}><DeleteButtonPage /></ProtectedRoute>
 *     -> requires login AND the role to carry ALL given permissions
 */
export default function ProtectedRoute({
  children,
  roles,
  permissions,
  requireAll = true,
}) {
  const { isAuthenticated, hasRole, canAll, canAny, initializing } = useAuth();
  const location = useLocation();

  // Avoid a flash-redirect to /login while we're still rehydrating the
  // session from localStorage on first mount.
  if (initializing) {
    return <div className="page-loading">Checking session...</div>;
  }

  if (!isAuthenticated) {
    // Remember where the user was trying to go so we can send them back
    // after a successful login.
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (roles && !hasRole(roles)) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (permissions) {
    const allowed = requireAll ? canAll(permissions) : canAny(permissions);
    if (!allowed) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
}

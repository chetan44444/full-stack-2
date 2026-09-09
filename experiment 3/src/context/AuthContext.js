import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import { mockLogin } from "../data/users";
import {
  roleHasPermission,
  roleHasAllPermissions,
  roleHasAnyPermission,
} from "../data/permissions";

const AuthContext = createContext(null);

const STORAGE_KEY = "rbac_demo_session";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | loading | error
  const [error, setError] = useState(null);
  const [initializing, setInitializing] = useState(true);

  // Rehydrate session from localStorage on first load, so a refresh
  // doesn't kick the user back to the login page.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        setUser(saved.user);
        setToken(saved.token);
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setInitializing(false);
    }
  }, []);

  const login = useCallback(async (username, password) => {
    setStatus("loading");
    setError(null);
    try {
      const { token: newToken, user: newUser } = await mockLogin(
        username,
        password
      );
      setUser(newUser);
      setToken(newToken);
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ user: newUser, token: newToken })
      );
      setStatus("idle");
      return newUser;
    } catch (err) {
      setStatus("error");
      setError(err.message);
      throw err;
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const can = useCallback(
    (permission) => roleHasPermission(user?.role, permission),
    [user]
  );

  const canAll = useCallback(
    (permissions) => roleHasAllPermissions(user?.role, permissions),
    [user]
  );

  const canAny = useCallback(
    (permissions) => roleHasAnyPermission(user?.role, permissions),
    [user]
  );

  const hasRole = useCallback(
    (roleOrRoles) => {
      if (!user) return false;
      if (Array.isArray(roleOrRoles)) return roleOrRoles.includes(user.role);
      return user.role === roleOrRoles;
    },
    [user]
  );

  const value = useMemo(
    () => ({
      user,
      token,
      role: user?.role || null,
      isAuthenticated: Boolean(user && token),
      initializing,
      status,
      error,
      login,
      logout,
      can,
      canAll,
      canAny,
      hasRole,
    }),
    [user, token, initializing, status, error, login, logout, can, canAll, canAny, hasRole]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an <AuthProvider>.");
  }
  return ctx;
}

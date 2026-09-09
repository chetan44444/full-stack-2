import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const DEMO_ACCOUNTS = [
  { role: "Admin", username: "alice", password: "admin123" },
  { role: "Editor", username: "bob", password: "editor123" },
  { role: "Viewer", username: "carol", password: "viewer123" },
];

export default function Login() {
  const { login, status, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const redirectTo = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
      navigate(redirectTo, { replace: true });
    } catch {
      // error is already captured in auth context state
    }
  };

  const fillDemo = (account) => {
    setUsername(account.username);
    setPassword(account.password);
  };

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <h1>Sign in</h1>
        <p className="subtitle">RBAC demo — try any of the roles below</p>

        <label htmlFor="username">Username</label>
        <input
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="e.g. alice"
          autoComplete="username"
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          autoComplete="current-password"
        />

        {error && <p className="error">{error}</p>}

        <button type="submit" disabled={status === "loading"}>
          {status === "loading" ? "Signing in..." : "Sign in"}
        </button>

        <div className="demo-accounts">
          <p>Demo accounts:</p>
          <ul>
            {DEMO_ACCOUNTS.map((acc) => (
              <li key={acc.role}>
                <button type="button" onClick={() => fillDemo(acc)} className="link-btn">
                  {acc.role}
                </button>
                <span className="demo-creds">
                  {acc.username} / {acc.password}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </form>
    </div>
  );
}

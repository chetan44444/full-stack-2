import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Can from "./Can";

export default function Navbar() {
  const { user, role, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) return null;

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">RBAC Demo</div>

      <div className="navbar-links">
        <NavLink to="/dashboard" className="nav-link">
          Dashboard
        </NavLink>

        {/* Only rendered if the role can view posts */}
        <Can permission="posts:view">
          <NavLink to="/posts" className="nav-link">
            Posts
          </NavLink>
        </Can>

        {/* Only Admins see the Users link */}
        <Can permission="users:view">
          <NavLink to="/admin/users" className="nav-link">
            Users
          </NavLink>
        </Can>

        {/* Only Admins see Settings */}
        <Can role="Admin">
          <NavLink to="/admin/settings" className="nav-link">
            Settings
          </NavLink>
        </Can>
      </div>

      <div className="navbar-user">
        <span className="user-name">{user.name}</span>
        <span className={`role-badge role-${role.toLowerCase()}`}>{role}</span>
        <button onClick={handleLogout} className="secondary">
          Logout
        </button>
      </div>
    </nav>
  );
}

import React from "react";
import { useAuth } from "../context/AuthContext";
import { ROLE_PERMISSIONS } from "../data/permissions";
import Can from "../components/Can";

export default function Dashboard() {
  const { user, role } = useAuth();
  const permissions = ROLE_PERMISSIONS[role] || [];

  return (
    <div className="page">
      <h1>Dashboard</h1>
      <p>
        Welcome, <strong>{user.name}</strong>. You are signed in as{" "}
        <strong>{role}</strong>.
      </p>

      <div className="card">
        <h2>Your permissions</h2>
        <ul className="permission-list">
          {permissions.map((p) => (
            <li key={p}>
              <code>{p}</code>
            </li>
          ))}
        </ul>
      </div>

      <Can
        role="Admin"
        fallback={
          <div className="card muted">
            <p>Admin-only insights are hidden from your role.</p>
          </div>
        }
      >
        <div className="card highlight">
          <h2>Admin insight</h2>
          <p>
            Only Admins can see this block — it demonstrates conditional UI
            rendering driven entirely by role, without any extra routing.
          </p>
        </div>
      </Can>
    </div>
  );
}

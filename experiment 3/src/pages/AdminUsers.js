import React from "react";
import { MOCK_USERS } from "../data/users";

export default function AdminUsers() {
  return (
    <div className="page">
      <h1>User Management</h1>
      <p className="muted">This page is restricted to the Admin role.</p>

      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Username</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {MOCK_USERS.map((u) => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.username}</td>
              <td>
                <span className={`role-badge role-${u.role.toLowerCase()}`}>
                  {u.role}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

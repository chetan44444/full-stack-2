import React from "react";

export default function AdminSettings() {
  return (
    <div className="page">
      <h1>Settings</h1>
      <p className="muted">This page is restricted to the Admin role.</p>

      <div className="card">
        <h2>Application settings (demo)</h2>
        <label>
          <input type="checkbox" defaultChecked /> Enable email notifications
        </label>
        <br />
        <label>
          <input type="checkbox" /> Require 2FA for all users
        </label>
      </div>
    </div>
  );
}

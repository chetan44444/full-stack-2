import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Unauthorized() {
  const { role } = useAuth();

  return (
    <div className="page center-page">
      <h1>403 — Access Denied</h1>
      <p>
        Your current role (<strong>{role}</strong>) doesn't have permission
        to view that page.
      </p>
      <Link to="/dashboard" className="link-btn">
        Back to Dashboard
      </Link>
    </div>
  );
}

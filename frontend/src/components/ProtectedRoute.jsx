// src/components/ProtectedRoute.jsx
import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { Spinner } from "react-bootstrap";

export default function ProtectedRoute({ permission }) {
  const { user, can } = useContext(AuthContext);

  // 1) Still loading user?
  if (user === null) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    );
  }

  // 2) Not authenticated?
  if (user === false) {
    return <Navigate to="/login" replace />;
  }

  // 3) If a permission is specified, enforce it
  //    If permission === null or undefined, skip this check
  if (permission && !can(permission)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // 4) All good
  return <Outlet />;
}

// src/components/MarkAttendance.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SubNavbar from ".././NavBar";

function MarkAttendance() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [hasMarked, setHasMarked] = useState(false);
  const [timestamp, setTimestamp] = useState(null);
  const [error, setError] = useState("");

  // 1) Pull the token. If missing, kick the user back to login:
  const authToken = localStorage.getItem("authToken");
  useEffect(() => {
    if (!authToken) {
      navigate("/login");
      return;
    }

    const headers = {
      "Accept": "application/json",
      // Remove Content-Type on empty POSTs
      "Authorization": `Bearer ${authToken}`,
    };

    // 2) Check if already marked today
    fetch("http://127.0.0.1:8000/api/attendance/today", {
      headers
    })
      .then(res => {
        if (res.status === 401) throw new Error("Unauthorized");
        return res.json();
      })
      .then(data => {
        if (data.marked) {
          setHasMarked(true);
          setTimestamp(data.timestamp);
        }
      })
      .catch(err => {
        console.error("Today check error:",err);
        setError(
          err.message === "Unauthorized"
            ? "Please log in again."
            : "Unable to check attendance status."
        );
      })
      .finally(() => setLoading(false));
  }, [authToken, navigate]);

  // 3) Handler to mark attendance
  const handleMark = () => {
    setLoading(true);

    const headers = {
      "Accept": "application/json",
      "Authorization": `Bearer ${authToken}`,
    };

    fetch("http://127.0.0.1:8000/api/attendance", {
      method: "POST",
      headers,
    })
      .then(res => {
        if (res.status === 401) throw new Error("Unauthorized");
        if (!res.ok) throw new Error(`Status ${res.status}`);
        return res.json();
      })
      .then(data => {
        setHasMarked(true);
        setTimestamp(data.timestamp);
      })
      .catch(err => {
        console.error("Mark error:", err);
        setError(
          err.message === "Unauthorized"
            ? "Please log in again."
            : "Failed to mark attendance. Please try again."
        );
      })
      .finally(() => setLoading(false));
  };

  return (
    <div>
      <SubNavbar />
      <div className="container text-center mt-5">
        <h2>Mark Your Attendance</h2>

        {loading && <p>Loading...</p>}

        {!loading && error && (
          <div className="alert alert-danger">{error}</div>
        )}

        {!loading && !hasMarked && (
          <button className="btn btn-primary btn-lg" onClick={handleMark}>
            Mark Attendance
          </button>
        )}

        {!loading && hasMarked && (
          <div className="alert alert-success">
            ✅ Attendance marked on{" "}
            <strong>{new Date(timestamp).toLocaleString()}</strong>
          </div>
        )}

        <button
          className="btn btn-link mt-3"
          onClick={() => navigate("/ViewMyAttendance")}
        >
          View Attendance History
        </button>
      </div>
    </div>
  );
}

export default MarkAttendance;

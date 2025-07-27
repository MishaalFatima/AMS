// src/components/ViewMyAttendance.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SubNavbar from ".././NavBar";

function ViewAttendance() {
  const navigate = useNavigate();
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const [records, setRecords]     = useState([]);

  // 1) Pull token & redirect if missing
  const authToken = localStorage.getItem("authToken");
  useEffect(() => {
    if (!authToken) {
      navigate("/login");
      return;
    }

    // 2) Fetch attendance history
    fetch("http://127.0.0.1:8000/api/attendance/history", {
      headers: {
        Accept:        "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then(res => {
        if (res.status === 401) {
          throw new Error("Unauthorized – please log in again.");
        }
        if (!res.ok) {
          throw new Error(`Server returned ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        // expecting an array of { marked_at: "ISO string" } or { date, timestamp }
        setRecords(data);
      })
      .catch(err => {
        console.error("Fetch history error:", err);
        setError(err.message || "Failed to load attendance history.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [authToken, navigate]);

  return (
    <div>
      <SubNavbar />

      <div className="container mt-5">
        <h2 className="mb-4">My Attendance History</h2>

        {loading && <p>Loading attendance records…</p>}

        {!loading && error && (
          <div className="alert alert-danger">{error}</div>
        )}

        {!loading && !error && records.length === 0 && (
          <p>You have not marked any attendance yet.</p>
        )}

        {!loading && !error && records.length > 0 && (
          <table className="table table-striped">
            <thead>
              <tr>
                <th>#</th>
                <th>Date</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {records.map((rec, idx) => {
                // If your API returns { date, timestamp } use those;
                // if it returns { marked_at }, split it:
                const ts = rec.timestamp || rec.marked_at;
                const dt = new Date(ts);
                const date = dt.toLocaleDateString();
                const time = dt.toLocaleTimeString();
                return (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>{date}</td>
                    <td>{time}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default ViewAttendance;

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Table, Spinner, Button } from "react-bootstrap";
import NavBar from ".././NavBar";

export default function StudentAttendance() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [records, setRecords] = useState([]);
  const [studentName, setStudentName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("authToken");
      try {
        // 1) Fetch attendance history for this student
        const [attRes, usersRes] = await Promise.all([
          fetch(`http://127.0.0.1:8000/api/attendance/${id}/history`, {
            headers: {
              Accept:        "application/json",
              Authorization: `Bearer ${token}`,
            },
          }),
          // 2) Fetch full users list for name lookup
          fetch("http://127.0.0.1:8000/api/users", {
            headers: {
              Accept:        "application/json",
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        // Handle attendance errors
        if (attRes.status === 404) {
          throw new Error("No attendance records found for this student.");
        }
        if (!attRes.ok) {
          throw new Error(`Attendance error: ${attRes.status}`);
        }

        // Warn on users fetch failure, but continue
        if (!usersRes.ok) {
          console.warn(
            "Could not fetch users for name lookup:",
            usersRes.status
          );
        }

        // Parse both responses
        const [attData, usersData] = await Promise.all([
          attRes.json(),
          usersRes.ok ? usersRes.json() : Promise.resolve([]),
        ]);

        setRecords(attData);

        // Find and set student name
        const matched = usersData.find((u) => String(u.id) === id);
        setStudentName(matched ? matched.UserName : "Unknown Student");
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load attendance.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <>
        <NavBar />
        <div className="container text-center mt-5">
          <Spinner animation="border" /> Loading attendance…
        </div>
      </>
    );
  }

  return (
    <div>
      <NavBar />
      <div className="container mt-4 mb-5">
        <Button variant="secondary" onClick={() => navigate(-1)}>
          ← Back
        </Button>
        <h2 className="mt-3">Attendance for {studentName}</h2>

        {error ? (
          <div className="alert alert-danger mt-3">{error}</div>
        ) : (
          <Table striped bordered hover className="mt-3">
            <thead>
              <tr>
                <th>Date</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {records.length > 0 ? (
                records.map((rec, idx) => (
                  <tr key={idx}>
                    <td>{rec.date}</td>
                    <td>{rec.time}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2} className="text-center">
                    No records to show.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        )}
      </div>
    </div>
  );
}

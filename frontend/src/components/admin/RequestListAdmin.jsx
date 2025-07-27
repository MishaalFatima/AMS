// src/components/RequestListAdmin.jsx
import { useState, useEffect } from "react";
import { Table, Button, Spinner, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import AdminNavBAr from ".././NavBar";

export default function RequestListAdmin() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("authToken");

  // Fetch all leave requests
  useEffect(() => {
    if (!token) return navigate("/login");

    fetch("http://127.0.0.1:8000/api/leaves", {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Error ${res.status}`);
        return res.json();
      })
      .then((data) => setRequests(data))
      .catch((err) => setError("Failed to load requests."))
      .finally(() => setLoading(false));
  }, [token, navigate]);

  // Approve or reject handler
  const handleAction = (id, action) => {
    setLoading(true);
    fetch(`http://127.0.0.1:8000/api/leaves/${id}/${action}`, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Error ${res.status}`);
        return res.json();
      })
      .then((updated) => {
        // Update single item in state
        setRequests((prev) =>
          prev.map((req) =>
            req.id === id ? { ...req, status: updated.status } : req
          )
        );
      })
      .catch(() => setError(`Failed to ${action} request.`))
      .finally(() => setLoading(false));
  };

  if (loading) return <Spinner animation="border" variant="primary" />;

  return (
    <div>
      <AdminNavBAr />
      <div className="container mt-4">
        <h3>Leave Requests</h3>
        {error && <Alert variant="danger">{error}</Alert>}
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Student</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req, idx) => (
              <tr key={req.id}>
                <td>{idx + 1}</td>
                <td>{req.user?.UserName || req.user?.name}</td>
                <td>{new Date(req.start_date).toLocaleDateString()}</td>
                <td>{new Date(req.end_date).toLocaleDateString()}</td>
                <td>{req.reason}</td>
                <td>
                  {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                </td>
                <td>
                  {req.status === "pending" ? (
                    <>
                      <Button
                        size="sm"
                        variant="success"
                        onClick={() => handleAction(req.id, "approve")}
                        className="me-2"
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleAction(req.id, "reject")}
                      >
                        Reject
                      </Button>
                    </>
                  ) : (
                    <em>No actions needed</em>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

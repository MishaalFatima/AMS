// src/components/admin/AssignedTasks.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AdminNavBar from ".././NavBar";

export default function AssignedTasks() {
  const [tasks, setTasks]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");
  const token                 = localStorage.getItem("authToken");

  // Fetch all tasks
  useEffect(() => {
    (async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("http://127.0.0.1:8000/api/taskList", {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data = await res.json();
        setTasks(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load tasks.");
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  // Helper to update status
  const updateStatus = async (taskId, newStatus) => {
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/tasks/${taskId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const updated = await res.json();
      setTasks((ts) =>
        ts.map((t) => (t.id === updated.id ? updated : t))
      );
    } catch (err) {
      console.error("Status update failed:", err);
      alert("Could not update task status.");
    }
  };

  if (loading) {
    return (
      <>
        <AdminNavBar />
        <div className="container text-center mt-5">
          <div className="spinner-border" role="status" />
          <p className="mt-2">Loading tasks…</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <AdminNavBar />
        <div className="container mt-5">
          <div className="alert alert-danger">{error}</div>
        </div>
      </>
    );
  }

  return (
    <>
      <AdminNavBar />
      <div className="container mt-4">
        <h2>All Assigned Tasks</h2>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Title</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Submission</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id}>
                <td>{task.student_id}</td>
                <td>{task.title}</td>
                <td>{new Date(task.due_date).toLocaleDateString()}</td>
                <td>
                  <span
                    className={`badge ${
                      task.status === "pending"
                        ? "bg-warning text-dark"
                        : task.status === "submitted"
                        ? "bg-info text-dark"
                        : task.status === "approved"
                        ? "bg-success text-white"
                        : task.status === "rejected"
                        ? "bg-danger text-white"
                        : ""
                    }`}
                  >
                    {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                  </span>
                </td>
                <td>
                  {task.submission_path ? (
                    <a
                      href={`http://127.0.0.1:8000/storage/submissions/${task.submission_path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-outline-primary"
                    >
                      Download
                    </a>
                  ) : (
                    <span className="text-muted">—</span>
                  )}
                </td>
                <td>
                  {task.status === "pending" && (
                    <Link
                      to={`/tasks/${task.id}/edit`}
                      className="btn btn-sm btn-outline-secondary me-2"
                    >
                      Edit
                    </Link>
                  )}

                  {task.status === "submitted" && (
                    <>
                      <button
                        className="btn btn-sm btn-outline-success me-2"
                        onClick={() => updateStatus(task.id, "approved")}
                      >
                        Approve
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => updateStatus(task.id, "rejected")}
                      >
                        Reject
                      </button>
                    </>
                  )}

                  {task.status === "approved" && (
                    <span className="text-success">Approved ✔︎</span>
                  )}

                  {task.status === "rejected" && (
                    <span className="text-danger">Rejected ✖︎</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

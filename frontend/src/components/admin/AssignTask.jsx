// src/components/AssignTask.jsx

import { useState, useEffect } from "react";
import SubNavbar from ".././NavBar";
import { Link } from "react-router-dom";

const AssignTask = () => {
  // Students state
  const [students, setStudents] = useState([]);
  const [studentLoading, setStudentLoading] = useState(true);
  const [studentError, setStudentError] = useState("");

  // Form state
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load students once
  useEffect(() => {
    (async () => {
      setStudentLoading(true);
      setStudentError("");

      try {
        const token = localStorage.getItem("authToken");
        const res = await fetch("http://127.0.0.1:8000/api/users", {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data = await res.json();
        const studentsOnly = data.filter(
          (u) => u.role && u.role.toLowerCase() === "student"
        );
        setStudents(studentsOnly);
      } catch (err) {
        console.error("Error loading students:", err);
        setStudentError("Failed to load students.");
      } finally {
        setStudentLoading(false);
      }
    })();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStudentId || !title || !description || !dueDate) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("authToken");
      const formData = new FormData();
      formData.append("student_id", selectedStudentId);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("due_date", dueDate);
      formData.append("status", "pending");

      const res = await fetch("http://127.0.0.1:8000/api/tasks", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      // Optional: log for debugging
      console.log("POST /api/tasks ->", res.status, res.ok);

      // Parse JSON once
      const payload = await res.json().catch(() => null);

      if (!res.ok) {
        const msg = payload?.message || `Error ${res.status}`;
        throw new Error(msg);
      }

      // ✅ SUCCESS: reset the form fields
      setSelectedStudentId("");
      setTitle("");
      setDescription("");
      setDueDate("");
      setError(""); // clear any leftover errors

      // Optionally show a toast/snackbar here to confirm success

      // If you still want to navigate away, uncomment:
      // navigate("/admin/tasks");
    } catch (err) {
      console.error("handleSubmit error:", err);
      setError(err.message || "An error occurred while assigning the task.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SubNavbar />
      <div className="container mt-4">
        <div className="card shadow">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="mb-4">Assign New Task</h3>
              <Link to="/AssignedTasks" className="btn btn-secondary">
                Assigned Tasks
              </Link>
            </div>

            {studentError && (
              <div className="alert alert-warning">{studentError}</div>
            )}
            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Student</label>
                <select
                  className="form-select"
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  disabled={studentLoading || !!studentError}
                >
                  <option value="">
                    {studentLoading
                      ? "Loading students..."
                      : studentError
                      ? studentError
                      : "-- Select Student --"}
                  </option>
                  {!studentLoading &&
                    !studentError &&
                    students.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.UserName || s.name} ({s.email})
                      </option>
                    ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Task title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  rows="4"
                  placeholder="Task details"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Due Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading || studentLoading}
              >
                {loading ? "Assigning…" : "Assign Task"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AssignTask;

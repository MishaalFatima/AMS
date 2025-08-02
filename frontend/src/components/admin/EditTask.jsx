// src/components/admin/EditTask.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminNavBar from ".././NavBar";

export default function EditTask() {
  const { taskId } = useParams();
  const navigate   = useNavigate();
  const token      = localStorage.getItem("authToken");

  // form state
  const [title, setTitle]             = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate]         = useState("");
  const [loading, setLoading]         = useState(true);
  const [saving, setSaving]           = useState(false);
  const [error, setError]             = useState("");

  // 1️⃣ Fetch the single task by ID
  useEffect(() => {
    (async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/api/tasks/${taskId}`,
          {
            headers: {
              Accept:        "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const task = await res.json();

        // Populate your form
        setTitle(task.title);
        setDescription(task.description);
        setDueDate(task.due_date);
      } catch (err) {
        console.error(err);
        setError("Failed to load task.");
      } finally {
        setLoading(false);
      }
    })();
  }, [taskId, token]);

  // 2️⃣ Submit updated fields via PUT (or PATCH if that’s what your route expects)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/tasks/${taskId}`,
        {
          method: "PUT",                            
          headers: {
            "Content-Type":  "application/json",
            Accept:          "application/json",
            Authorization:   `Bearer ${token}`,
          },
          body: JSON.stringify({ title, description, due_date: dueDate }),
        }
      );

      if (res.status === 422) {
        const payload = await res.json();
        const msgs    = Object.values(payload.errors || {})
                             .flat()
                             .join(" ");
        throw new Error(msgs || "Validation failed.");
      }
      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload.message || `Error ${res.status}`);
      }

      navigate("/AssignedTasks");
    } catch (err) {
      console.error(err);
      setError(err.message || "Update failed.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <AdminNavBar />
        <div className="container text-center mt-5">
          <div className="spinner-border" role="status" />
          <p className="mt-2">Loading task…</p>
        </div>
      </>
    );
  }

  return (
    <>
      <AdminNavBar />
      <div className="container mt-4">
        <div className="card shadow">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="mb-0">Edit Task #{taskId}</h3>
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => navigate("/AssignedTasks")}
              >
                ← Back to Assigned Tasks
              </button>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
              {/* Title */}
              <div className="mb-3">
                <label className="form-label">Title</label>
                <input
                  className="form-control"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              {/* Description */}
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  rows="4"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              {/* Due Date */}
              <div className="mb-3">
                <label className="form-label">Due Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
              >
                {saving ? "Saving…" : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

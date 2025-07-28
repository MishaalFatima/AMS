// src/components/StudentTaskSubmit.jsx

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SubNavbar from ".././NavBar";

export default function TaskSubmission() {
  // grab both possible param names and pick the one that’s defined
  const params = useParams();
  const taskId = params.taskId ?? params.task ?? null;
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [loadingTask, setLoadingTask] = useState(true);
  const [taskError, setTaskError] = useState("");

  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // 1️⃣ Load the task details (only if we have a valid ID)
  useEffect(() => {
    if (!taskId) {
      setTaskError("No task ID provided in the URL.");
      setLoadingTask(false);
      return;
    }

    (async () => {
      setLoadingTask(true);
      setTaskError("");
      try {
        const token = localStorage.getItem("authToken");
        const res = await fetch(
          `http://127.0.0.1:8000/api/tasks/${taskId}`,
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.status === 404) {
          setTaskError("Task not found (404).");
          return;
        }
        if (!res.ok) {
          throw new Error(`Unexpected error ${res.status}`);
        }

        const data = await res.json();
        setTask(data);
      } catch (err) {
        console.error("Error loading task:", err);
        setTaskError("Failed to load task details.");
      } finally {
        setLoadingTask(false);
      }
    })();
  }, [taskId]);

  // 2️⃣ Handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setSubmissionError("");
    setSuccessMsg("");
  };

  // 3️⃣ Submit file
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setSubmissionError("Please choose a file to submit.");
      return;
    }

    setSubmitting(true);
    setSubmissionError("");
    setSuccessMsg("");

    try {
      if (!taskId) throw new Error("Invalid task ID.");

      const token = localStorage.getItem("authToken");
      const formData = new FormData();
      formData.append("submission", file);

      const res = await fetch(
        `http://127.0.0.1:8000/api/tasks/${taskId}/submit`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (res.status === 404) {
        throw new Error("Task not found (404).");
      }
      const payload = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(payload?.message || `Submission failed (${res.status})`);
      }

      setSuccessMsg("File submitted successfully!");
      setFile(null);

      // update local state so user sees the new status & download link
      setTask((t) => ({
        ...t,
        status: "submitted",
        submission_path: payload.submission_path,
      }));
    } catch (err) {
      console.error("Submission error:", err);
      setSubmissionError(err.message || "Error submitting file.");
    } finally {
      setSubmitting(false);
    }
  };

  // 4️⃣ Render
  if (loadingTask) {
    return (
      <>
        <SubNavbar />
        <div className="container text-center mt-5">
          <div className="spinner-border" role="status" />
          <p className="mt-2">Loading task…</p>
        </div>
      </>
    );
  }

  if (taskError) {
    return (
      <>
        <SubNavbar />
        <div className="container mt-5">
          <div className="alert alert-danger">{taskError}</div>
          <button
            className="btn btn-secondary mt-3"
            onClick={() => navigate(-1)}
          >
            Go Back
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <SubNavbar />
      <div className="container mt-4">
        <h2>Submit Task</h2>

        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">{task.title}</h5>
            <p className="card-text">{task.description}</p>
            <p className="text-muted mb-1">
              Due: {new Date(task.due_date).toLocaleDateString()}
            </p>
            <p>
              Status:{" "}
              <span
                className={`badge ${
                  task.status === "pending"
                    ? "bg-warning text-dark"
                    : task.status === "submitted"
                    ? "bg-info text-dark"
                    : "bg-success text-white"
                }`}
              >
                {task.status}
              </span>
            </p>
            {task.submission_path && (
              <p className="mt-2">
                <a
                  href={`http://127.0.0.1:8000/storage/submissions/${task.submission_path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-outline-primary"
                >
                  Download Your Submission
                </a>
              </p>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Choose File</label>
            <input
              type="file"
              className="form-control"
              accept=".pdf,.doc,.docx,.jpg,.png"
              onChange={handleFileChange}
              disabled={submitting || task.status !== "pending"}
            />
          </div>

          {submissionError && (
            <div className="alert alert-danger">{submissionError}</div>
          )}
          {successMsg && (
            <div className="alert alert-success">{successMsg}</div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting || task.status !== "pending"}
          >
            {submitting ? "Submitting…" : "Submit Task"}
          </button>
        </form>
      </div>
    </>
  );
}

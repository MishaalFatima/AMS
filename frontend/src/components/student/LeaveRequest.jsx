// src/components/LeaveRequest.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SubNavbar from ".././NavBar";

export default function LeaveRequest() {
  const navigate = useNavigate();
  const [loading, setLoading]    = useState(false);
  const [error, setError]        = useState("");
  const [success, setSuccess]    = useState("");
  const [form, setForm]          = useState({
    startDate: "",
    endDate: "",
    reason: "",
  });

  const token = localStorage.getItem("authToken");
  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setError(""); setSuccess("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(""); setSuccess("");

    if (!form.startDate || !form.endDate) {
      return setError("Please select both dates.");
    }
    if (new Date(form.endDate) < new Date(form.startDate)) {
      return setError("End date cannot come before start date.");
    }

    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/leaves", {
        method: "POST",
        headers: {
          "Accept":        "application/json",
          "Content-Type":  "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to send request");
      }

      setSuccess("Leave requested—awaiting admin approval.");
      setForm({ startDate: "", endDate: "", reason: "" });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <SubNavbar />
      <div className="container mt-5">
        <h2>Request Leave</h2>
        {error   && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-md-4">
            <label>Start Date</label>
            <input
              type="date"
              name="startDate"
              className="form-control"
              value={form.startDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-4">
            <label>End Date</label>
            <input
              type="date"
              name="endDate"
              className="form-control"
              value={form.endDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-12">
            <label>Reason</label>
            <textarea
              name="reason"
              className="form-control"
              rows={3}
              value={form.reason}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-12">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

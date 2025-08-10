// src/components/ForgotPassword.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import HeaderComponent from "./header";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("http://127.0.0.1:8000/api/password/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = data.message || data.error || "Could not send reset link.";
        throw new Error(msg);
      }

      setMessage("If an account exists with that email, a reset link has been sent.");
      // optionally navigate to login after short delay
      // setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.message || "Failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <HeaderComponent />
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card p-4">
              <h4 className="mb-3">Reset your password</h4>
              {message && <div className="alert alert-success">{message}</div>}
              {error && <div className="alert alert-danger">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? "Sending…" : "Send reset link"}
                </button>

                <Link to="/login" className="btn btn-link ms-3">
                  Back to Login
                </Link>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

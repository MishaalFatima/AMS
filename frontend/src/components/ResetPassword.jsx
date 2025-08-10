// src/components/ResetPassword.jsx
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import HeaderComponent from "./header";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const tokenParam = searchParams.get("token") || "";
  const emailParam = searchParams.get("email") || "";

  const [token, setToken] = useState(tokenParam);
  const [email, setEmail] = useState(emailParam);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (tokenParam) setToken(tokenParam);
    if (emailParam) setEmail(emailParam);
  }, [tokenParam, emailParam]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("http://127.0.0.1:8000/api/password/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          token,
          email,
          password,
          password_confirmation: confirm,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = data.message || Object.values(data.errors || {})?.flat()?.[0] || "Reset failed";
        throw new Error(msg);
      }

      setMessage("Password has been reset. Redirecting to login…");
      setTimeout(() => navigate("/login"), 1600);
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
              <h4 className="mb-3">Choose a new password</h4>
              {message && <div className="alert alert-success">{message}</div>}
              {error && <div className="alert alert-danger">{error}</div>}

              <form onSubmit={handleSubmit}>
                <input type="hidden" value={token} />
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
                <div className="mb-3">
                  <label className="form-label">New password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Confirm new password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>

                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? "Resetting…" : "Reset password"}
                </button>
                <Link to="/login" className="btn btn-link ms-3">Back to Login</Link>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

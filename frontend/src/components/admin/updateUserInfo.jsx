// src/components/admin/UpdateUserInfo.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Button, Spinner } from "react-bootstrap";
import AdminNavBar from ".././NavBar";

export default function UpdateUserInfo() {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const token        = localStorage.getItem("authToken");
  

  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState("");
  const [rolesList, setRolesList] = useState([]);
  const [form, setForm]           = useState({
    UserName: "",
    email:    "",
    phone:    "",
    role_id:     "",
  });

  useEffect(() => {
    // We want to fetch roles & user data in parallel
    setLoading(true);
    Promise.all([
      fetch("http://127.0.0.1:8000/api/roles", {
        headers: { Authorization: `Bearer ${token}` }
      }),
      fetch(`http://127.0.0.1:8000/api/users/${id}`, {
        headers: {
          Accept:        "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
    ])
      .then(async ([rolesRes, userRes]) => {
        if (!rolesRes.ok) throw new Error("Could not load roles");
        if (!userRes.ok)  throw new Error("Could not load user");

        const rolesData = await rolesRes.json();  
        const userData  = await userRes.json();

        // Store dropdown options
        setRolesList(rolesData);

        // Pre-fill form
        setForm({
          UserName: userData.UserName,
          email:    userData.email,
          phone:    userData.phone || "",
          role_id:  userData.role_id?.toString() || "",
        });
      })
      .catch(err => {
        console.error(err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [id, token]);

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/user/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept:         "application/json",
          Authorization:  `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (res.status === 422) {
        const payload = await res.json();
        const msgs = Object.values(payload.errors || {})
                           .flat()
                           .join(" ");
        throw new Error(msgs);
      }
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Error ${res.status}: ${text}`);
      }

      navigate("/users");
    } catch (err) {
      console.error("Update failed:", err);
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
          <Spinner animation="border" /> Loading…
        </div>
      </>
    );
  }

  return (
    <>
      <AdminNavBar />
      <div className="container mt-4 mb-5">
        <h2>Edit User #{id}</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <Form onSubmit={handleSubmit} className="mt-3">
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              name="UserName"
              value={form.UserName}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Phone</Form.Label>
            <Form.Control
              name="phone"
              value={form.phone}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Role</Form.Label>
            <Form.Select
              name="role_id"
              value={form.role_id}
              onChange={handleChange}
              required
            >
              <option value="">-- select a role --</option>
              {rolesList.map(r => (
                <option key={r.id} value={r.id}>
                  {r.name.charAt(0).toUpperCase() + r.name.slice(1)}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Button variant="primary" type="submit" disabled={saving}>
            {saving ? "Saving…" : "Save Changes"}
          </Button>{" "}
          <Button variant="secondary" onClick={() => navigate("/users")}>
            Cancel
          </Button>
        </Form>
      </div>
    </>
  );
}

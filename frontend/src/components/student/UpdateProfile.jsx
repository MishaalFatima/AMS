// src/components/UpdateProfile.jsx
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import SubNavbar from ".././NavBar";
import { AuthContext } from "../../contexts/AuthContext.jsx";

export default function UpdateProfile() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem("authToken");

  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState("");
  const [profile, setProfile]   = useState(null);

  // include role_id in formData
  const [formData, setFormData] = useState({
    UserName: "",
    email:    "",
    phone:    "",
    img_uri:  null,
    role_id:  "",          // ← keep the user’s role_id here
  });

  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (!token || !user?.id) {
      navigate("/login");
      return;
    }

    fetch(`http://127.0.0.1:8000/api/users/${user.id}`, {
      headers: {
        Accept:        "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        if (res.status === 401) throw new Error("Unauthorized");
        if (!res.ok) throw new Error(`Error ${res.status}`);
        return res.json();
      })
      .then(data => {
        setProfile(data);
        setFormData({
          UserName: data.UserName,
          email:    data.email,
          phone:    data.phone || "",
          img_uri:  null,
          role_id:  data.role_id?.toString() || "",  // ← store it
        });
        // build avatar preview URL
        const url = data.avatar_url?.startsWith("http")
          ? data.avatar_url
          : `http://127.0.0.1:8000${data.avatar_url || ""}`;
        setPreview(url);
      })
      .catch(err => {
        setError(
          err.message === "Unauthorized"
            ? "Please log in again."
            : "Failed to load profile."
        );
      })
      .finally(() => setLoading(false));
  }, [token, user, navigate]);

  const handleChange = e => {
    setError("");
    setSuccess("");
    setFormData(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleFile = e => {
    const file = e.target.files[0];
    if (!file) return;
    setFormData(f => ({ ...f, img_uri: file }));
    const reader = new FileReader();
    reader.onload = ev => setPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!profile) return;

    setLoading(true);
    setError("");
    setSuccess("");

    const body = new FormData();
    body.append("UserName", formData.UserName);
    body.append("email",    formData.email);
    body.append("phone",    formData.phone);
    body.append("role_id",  formData.role_id);      // ← include the frozen role_id
    if (formData.img_uri) body.append("img_uri", formData.img_uri);

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/user/${profile.id}`,
        {
          method: "POST",
          headers: {
            Accept:        "application/json",
            Authorization: `Bearer ${token}`,
          },
          body,
        }
      );

      if (res.status === 422) {
        const errJson = await res.json();
        const messages = Object.values(errJson.errors || {})
          .flat()
          .join(" ");
        throw new Error(messages || "Validation failed.");
      }
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Update failed (${res.status}): ${txt}`);
      }

      setSuccess("Profile updated successfully!");
      setTimeout(() => navigate("/profile"), 1000);
    } catch (err) {
      console.error("UPDATE ERROR:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profile) {
    return (
      <>
        <SubNavbar />
        <div className="container text-center mt-5">
          <p>Loading profile…</p>
        </div>
      </>
    );
  }

  return (
    <div>
      <SubNavbar />
      <div className="container mt-5 mb-5">
        <h2 className="mb-4">Edit Profile</h2>
        {error   && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit} className="row g-4">
          <div className="col-md-3 text-center">
            {preview ? (
              <img
                src={preview}
                alt="Avatar Preview"
                className="rounded-circle mb-3"
                style={{ width: 150, height: 150, objectFit: "cover" }}
                onError={e => (e.target.style.display = "none")}
              />
            ) : (
              <div
                className="border rounded-circle mb-3 d-flex align-items-center justify-content-center"
                style={{ width: 150, height: 150 }}
              >
                No Avatar
              </div>
            )}
            <input
              type="file"
              name="img_uri"
              className="form-control"
              onChange={handleFile}
            />
          </div>

          <div className="col-md-9">
            {/* Username */}
            <div className="mb-3">
              <label className="form-label">Username</label>
              <input
                type="text"
                name="UserName"
                className="form-control"
                value={formData.UserName}
                onChange={handleChange}
                required
              />
            </div>

            {/* Email */}
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Phone */}
            <div className="mb-3">
              <label className="form-label">Phone</label>
              <input
                type="text"
                name="phone"
                className="form-control"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            {/* Role (visible but disabled) */}
            <div className="mb-3">
              <label className="form-label">Role</label>
              <select
                className="form-select"
                name="role_id"
                value={formData.role_id}
                disabled
              >
                <option>
                  {profile.roles?.[0]?.name
                    ? profile.roles[0].name.charAt(0).toUpperCase() +
                      profile.roles[0].name.slice(1)
                    : "—"}
                </option>
              </select>
            </div>

            {/* Submit / Cancel */}
            <button
              type="submit"
              className="btn btn-success me-2"
              disabled={loading}
            >
              {loading ? "Saving…" : "Save Changes"}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/profile")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// src/components/Profile.jsx
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import SubNavbar from ".././NavBar.jsx";
import { AuthContext } from "../../contexts/AuthContext.jsx";

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // If AuthContext gives you user.id, use that; else fallback to localStorage
  const userId = user?.id || localStorage.getItem("userId");
  const token  = localStorage.getItem("authToken");

  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (!token || !userId) {
      navigate("/login");
      return;
    }

    fetch(`http://127.0.0.1:8000/api/users/${userId}`, {
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
      })
      .catch(err => {
        console.error("PROFILE FETCH ERROR:", err);
        setError(
          err.message === "Unauthorized"
            ? "Please log in again."
            : "Failed to load profile."
        );
      })
      .finally(() => setLoading(false));
  }, [token, userId, navigate]);

  if (loading) {
    return (
      <div>
        <SubNavbar />
        <div className="container text-center mt-5">
          <p>Loading profile…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <SubNavbar />
        <div className="container text-center mt-5">
          <div className="alert alert-danger">{error}</div>
        </div>
      </div>
    );
  }

  // Build avatar URL
  const avatarUrl = profile.avatar_url?.startsWith("http")
    ? profile.avatar_url
    : `http://127.0.0.1:8000${profile.avatar_url}`;

  // Determine displayed role name:
  const rawRoleName = 
    // first try your belongsTo('role')
    profile.role?.name
    // fallback to Spatie's roles array
    || (profile.roles && profile.roles[0]?.name)
    || "";

  const displayRole = rawRoleName
    ? rawRoleName.charAt(0).toUpperCase() + rawRoleName.slice(1)
    : "-";

  return (
    <div>
      <SubNavbar />
      <div className="container mt-5 mb-5">
        <h2 className="mb-4">My Profile</h2>

        <div className="row">
          <div className="col-md-3 text-center">
            {profile.avatar_url ? (
              <img
                src={avatarUrl}
                alt="Avatar"
                className="img-thumbnail rounded-circle"
                style={{
                  width: 150,
                  height: 150,
                  objectFit: "cover",
                }}
                onError={e => { e.target.style.display = "none"; }}
              />
            ) : (
              <div className="border p-5">No Avatar</div>
            )}
          </div>

          <div className="col-md-9">
            <p><strong>Username:</strong> {profile.UserName}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Phone:</strong> {profile.phone || "-"}</p>
            <p><strong>Role:</strong> {displayRole}</p>
            <button
              className="btn btn-primary mt-3"
              onClick={() => navigate("/UpdateProfile")}
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

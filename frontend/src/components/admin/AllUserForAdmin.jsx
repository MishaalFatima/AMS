// src/components/AllUserForAdmin.jsx
import { useState, useEffect } from "react";
import { Table, Button }      from "react-bootstrap";
import { useNavigate }        from "react-router-dom";
import AdminNavBar            from "../NavBar";

export default function AllUserForAdmin() {
  const [userList, setUserList]   = useState([]);
  const [rolesMap, setRolesMap]   = useState({});   // ← id→name lookup
  const navigate                  = useNavigate();

  useEffect(() => {
    refreshData();
  }, []);

  async function refreshData() {
    const token = localStorage.getItem("authToken");
    try {
      // 1) Fetch roles & users in parallel
      const [rolesRes, usersRes] = await Promise.all([
        fetch("http://127.0.0.1:8000/api/roles", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("http://127.0.0.1:8000/api/userList", {
          headers: {
            Accept:        "application/json",
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      if (!rolesRes.ok) throw new Error("Could not load roles");
      if (!usersRes.ok) throw new Error("Could not load users");

      const rolesData = await rolesRes.json();
      const usersData = await usersRes.json();

      // 2) Build id→name map
      const map = {};
      rolesData.forEach(r => {
        map[r.id] = r.name.charAt(0).toUpperCase() + r.name.slice(1);
      });
      setRolesMap(map);

      // 3) Store users
      setUserList(usersData);
    } catch (err) {
      console.error(err);
      alert("Failed to load data: " + err.message);
    }
  }

  async function handleDelete(id) {
    const token = localStorage.getItem("authToken");
    const res = await fetch(`http://127.0.0.1:8000/api/user/${id}`, {
      method:  "DELETE",
      headers: {
        Accept:        "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.ok) {
      setUserList(u => u.filter(x => x.id !== id));
    } else {
      console.error("Delete failed:", res.status, await res.text());
    }
  }

  return (
    <div>
      <AdminNavBar />
      <div className="container mt-5">
        <Table striped bordered hover variant="dark">
          <thead>
            <tr>
              <th>Id</th>
              <th>Image</th>
              <th>User Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>     {/* ← now shows name */}
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {userList.length ? (
              userList.map(user => {
                const avatarSrc = user.avatar_url
                  ? (user.avatar_url.startsWith("http")
                      ? user.avatar_url
                      : `http://127.0.0.1:8000${user.avatar_url}`)
                  : null;

                return (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>
                      {avatarSrc ? (
                        <img
                          src={avatarSrc}
                          alt={`${user.UserName} avatar`}
                          style={{
                            width:        60,
                            height:       60,
                            objectFit:    "cover",
                            borderRadius: "50%",
                          }}
                          onError={e => { e.target.style.display = "none"; }}
                        />
                      ) : (
                        <span>No avatar</span>
                      )}
                    </td>
                    <td>{user.UserName}</td>
                    <td>{user.email}</td>
                    <td>{user.phone || "–"}</td>
                    <td>{rolesMap[user.role_id] || "–"}</td>
                    <td>
                      <Button
                        variant="warning"
                        size="sm"
                        onClick={() => navigate(`/users/${user.id}/edit`)}
                      >
                        Edit
                      </Button>
                    </td>
                    <td>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(user.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="8" className="text-center">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

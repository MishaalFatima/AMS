// src/components/StudentListForAttendance.jsx
import { useState, useEffect } from "react";
import { Table, Spinner, Button } from "react-bootstrap";
import { useNavigate }            from "react-router-dom";
import AdminNavBar                from "../NavBar"; // or TeacherNavBar

export default function StudentListForAttendance() {
  const [students, setStudents] = useState([]);
  const [rolesMap, setRolesMap] = useState({});
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const navigate                 = useNavigate();

  useEffect(() => {
    (async function fetchData() {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("authToken");

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
          map[r.id] = r.name.toLowerCase();
        });
        setRolesMap(map);

        // 3) Filter only students by role name
        const studentsOnly = usersData.filter(
          u => map[u.role_id] === "student"
        );
        setStudents(studentsOnly);
      } catch (err) {
        console.error(err);
        setError("Failed to load student list.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <>
        <AdminNavBar />
        <div className="container text-center mt-5">
          <Spinner animation="border" /> Loading students…
        </div>
      </>
    );
  }
  if (error) {
    return (
      <>
        <AdminNavBar />
        <div className="container text-center mt-5">
          <div className="alert alert-danger">{error}</div>
        </div>
      </>
    );
  }

  return (
    <div>
      <AdminNavBar />
      <div className="container mt-5">
        <h2>Students</h2>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Student Id</th>
              <th>Profile</th>
              <th>Username</th>
              <th>Email</th>
              <th>Phone</th>
              <th>View Attendance</th>
            </tr>
          </thead>
          <tbody>
            {students.length > 0 ? (
              students.map(user => {
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
                            width:        40,
                            height:       40,
                            objectFit:    "cover",
                            borderRadius: "50%",
                          }}
                          onError={e => (e.target.style.display = "none")}
                        />
                      ) : (
                        <span>–</span>
                      )}
                    </td>
                    <td>{user.UserName}</td>
                    <td>{user.email}</td>
                    <td>{user.phone || "–"}</td>
                    <td>
                      <Button
                        variant="info"
                        size="sm"
                        onClick={() => navigate(`/attendance/${user.id}`)}
                      >
                        View Attendance
                      </Button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  No students found.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

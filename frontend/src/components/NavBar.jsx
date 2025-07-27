// src/components/NavBar.jsx
import { useContext, useEffect } from "react";
import { Navbar, Container, Nav, Button, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

// 1) All possible menu items in one place
const menuConfig = [
  { to: "/dashboard",          label: "Dashboard",           perm: null },
  { to: "/users",              label: "All Users",          perm: "view_users" },
  { to: "/StudentListForAttendance",     label: "Attendance Records", perm: "view_attendance" },
  { to: "/MarkAttendance",    label: "Mark Attendance",     perm: "mark_attendance" },
  { to: "/ViewMyAttendance",    label: "My Attendance",       perm: "view_own_attendance" },
  { to: "/LeaveRequest",     label: "Request Leave",       perm: "request_leave" },
  { to: "/StudentRequestList",        label: "My Leave Status",     perm: "view_own_leaves" },
  { to: "/leaves/all",         label: "Approve Leaves",      perm: "approve_leave" },
  { to: "/tasks/assign",       label: "Assign Task",         perm: "assign_task" },
  { to: "/tasks/mine",         label: "My Tasks",            perm: "submit_task" },
  { to: "/tasks/pending",      label: "Approve Tasks",       perm: "approve_task" },
  { to: "/Profile",            label: "My Profile",          perm: "edit_profile" },
  { to: "/roles",              label: "Roles & Permissions", perm: "manage_roles" },
];

export default function NavBar() {
  const { user, perms, can, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // 2) Log your perms on every render (for debugging)
  useEffect(() => {
    console.log("🔑 current permissions:", perms);
  }, [perms]);

  // 3) Handle loading / unauthenticated states
  if (user === null) {
    // still fetching /api/user
    return (
      <div className="text-center mt-4">
        <Spinner animation="border" />
      </div>
    );
  }
  if (user === false) {
    // not logged in
    return null;
  }

  const handleLogout = () => {
    logout();          // clears token + perms in context
    navigate("/login");
  };

  return (
    <Navbar bg="light" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/dashboard">
          <strong>Welcome, {user.UserName}</strong>
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="me-auto">
            {menuConfig.map(({ to, label, perm }) => {
              // show if perm is null (dashboard) OR if user has that perm
              if (perm === null || can(perm)) {
                return (
                  <Nav.Link key={to} as={Link} to={to}>
                    {label}
                  </Nav.Link>
                );
              }
              return null;
            })}
          </Nav>
          <Nav>
            <Button variant="outline-danger" onClick={handleLogout}>
              Log Out
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

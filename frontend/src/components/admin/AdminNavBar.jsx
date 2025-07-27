import React from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

function AdminNavBar() {
  const navigate = useNavigate();

  // Log out and redirect to home/login page
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/home');
  };

  return (
    <Navbar bg="light" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/WelcomePageAdmin">
          <strong>Admin Dashboard</strong>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="admin-navbar-nav" />
        <Navbar.Collapse id="admin-navbar-nav">
          <Nav className="me-auto">

            {/* View All Users */}
            <Nav.Link as={Link} to="/AllUserForAdmin">
              View All Users
            </Nav.Link>

            {/* Attendance Records */}
            <Nav.Link as={Link} to="/StudentListForAttendance">
              Attendance Records
            </Nav.Link>

            {/* Leave Approval */}
            <Nav.Link as={Link} to="/RequestListAdmin">
              Leave Requests
            </Nav.Link>

            {/* Task Management */}
            <Nav.Link as={Link} to="/AssignTask">
              Task Management
            </Nav.Link>

            {/* Roles & Permissions */}
            <Nav.Link as={Link} to="/RolePermissionManagement">
              Roles & Permissions
            </Nav.Link>

          </Nav>

          {/* Right‑aligned logout button */}
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

export default AdminNavBar;

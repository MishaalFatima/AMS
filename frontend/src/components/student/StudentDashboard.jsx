import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";


function StudentDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/home');
  };

  return (
    <Navbar bg="light" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/WelcomePageStudent" className="fw-bold">
          Welcome, Student!
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="student-dashboard-nav" />
        <Navbar.Collapse id="student-dashboard-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/MarkAttendance">
              Mark Attendance
            </Nav.Link>
            <Nav.Link as={Link} to="/LeaveRequest">
              Request Leave
            </Nav.Link>
            <Nav.Link as={Link} to="/StudentRequestList">
              Request Status
            </Nav.Link>
            <Nav.Link as={Link} to="/ViewMyAttendance">
              View Attendance
            </Nav.Link>
            <Nav.Link as={Link} to="/MyTasks">
              Submit Task
            </Nav.Link>
            <Nav.Link as={Link} to="/Profile">
              My Profile
            </Nav.Link>
          </Nav>
          <Button variant="outline-danger" onClick={handleLogout}>
            Log Out
          </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default StudentDashboard;

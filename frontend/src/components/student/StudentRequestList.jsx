import { useState, useEffect } from 'react';
import { Table, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import SubNavbar from '.././NavBar';

export default function StudentRequestList() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');

  const token = localStorage.getItem('authToken');

  useEffect(() => {
    if (!token) return navigate('/login');

    // Fetch only this user's leave requests
    fetch('http://127.0.0.1:8000/api/leaves/my-requests', {
      headers: {
        Accept:        'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        if (!res.ok) throw new Error(`Error ${res.status}`);
        return res.json();
      })
      .then(data => setRequests(data))
      .catch(() => setError('Failed to load your leave requests.'))
      .finally(() => setLoading(false));
  }, [token, navigate]);

  if (loading) return <Spinner animation="border" variant="primary" />;

  return (
    <div>
          <SubNavbar />
    <div className="container mt-4">
      <h3>Your Leave Requests</h3>
      {error && <Alert variant="danger">{error}</Alert>}

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Submitted At</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req, idx) => (
            <tr key={req.id}>
              <td>{idx + 1}</td>
              <td>{new Date(req.start_date).toLocaleDateString()}</td>
              <td>{new Date(req.end_date).toLocaleDateString()}</td>
              <td>{req.reason}</td>
              <td>
                {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
              </td>
              <td>
                {new Date(req.created_at).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
    </div>
  );
}

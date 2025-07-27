// src/components/Unauthorized.jsx
import { Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function Unauthorized() {
  const nav = useNavigate();
  return (
    <Container className="text-center my-5">
      <h1 className="display-4">403 – Unauthorized</h1>
      <p className="lead">Sorry, you don’t have permission to view this page.</p>
      <Button variant="primary" onClick={() => nav(-1)}>
        Go Back
      </Button>
    </Container>
  );
}

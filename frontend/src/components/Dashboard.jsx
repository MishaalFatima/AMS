import { useContext } from 'react';
import { Container } from 'react-bootstrap';
import { AuthContext } from '../contexts/AuthContext';
import NavBar from './NavBar.jsx';

export default function Dashboard() {
  const { user, perms } = useContext(AuthContext);

  return (
    <Container>
      <NavBar />
      <h1 className="mt-4">Welcome, {user.UserName}!</h1>
      <p>Your granted permissions:</p>
      <ul>
        {perms.map(p => (
          <li key={p}>{p}</li>
        ))}
      </ul>
    </Container>
  );
}

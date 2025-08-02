import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import NavBar from "./NavBar.jsx";

export default function Dashboard() {
  const { user, perms } = useContext(AuthContext);

  return (
    <div>
      <NavBar />
      <div className="container mt-5">
        <h1 className="mt-4">Welcome, {user.UserName}!</h1>
        <p>Your granted permissions:</p>
        <ul>
          {perms.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

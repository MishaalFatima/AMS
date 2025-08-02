import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SubNavbar from ".././NavBar";

export default function StudentTasksList() {
  const [tasks, setTasks] = useState([]);
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/tasks", {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(setTasks)
      .catch(console.error);
  }, [token]);

  return (
    <>
      <SubNavbar />
      <div className="container mt-4">
        <h2>Your Tasks</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Due</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id}>
                <td>{task.title}</td>
                <td>{new Date(task.due_date).toLocaleDateString()}</td>
                <td>
                  <span
                    className={`badge ${
                      task.status === "pending"
                        ? "bg-warning text-dark"
                        : task.status === "submitted"
                        ? "bg-info text-dark"
                        : "bg-success text-white"
                    }`}
                  >
                    {task.status}
                  </span>
                </td>
                <td>
                  <Link
                    to={`/TaskSubmission/${task.id}`}
                    className="btn btn-sm btn-primary"
                    disabled={task.status !== "pending"}
                  >
                    Submit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

// src/App.jsx
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./components/Home.jsx";
import LoginComponent from "./components/LoginComponent.jsx";
import RegisterComponent from "./components/RegisterComponent.jsx";
import Unauthorized from "./components/Unauthorized.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Dashboard from "./components/Dashboard.jsx";

import AllUserForAdmin from "./components/admin/AllUserForAdmin.jsx";
import MarkAttendance from "./components/student/MarkAttendance.jsx";
import ViewMyAttendance from "./components/student/ViewAttendance.jsx";
import StudentListForAttendance from "./components/admin/StudentListForAttendance.jsx";
import StudentAttendance from "./components/admin/StudentAttendance.jsx";
import LeaveRequest from "./components/student/LeaveRequest.jsx";
import StudentRequestList from "./components/student/StudentRequestList.jsx";
import RequestListAdmin from "./components/admin/RequestListAdmin.jsx";
import AssignTask from "./components/admin/AssignTask.jsx";
import StudentTasksList from "./components/student/StudentTasksList.jsx";
import TaskSubmission from "./components/student/TaskSubmission.jsx";
import AssignedTasks from "./components/admin/AssignedTasks.jsx";
import EditTask from "./components/admin/EditTask.jsx";
import Profile from "./components/student/Profile.jsx";
import UpdateProfile from "./components/student/UpdateProfile.jsx";
import RolePermissionManagement from "./components/admin/RolePermissionManagement.jsx";
import UpdateUserInfo from "./components/admin/updateUserInfo.jsx";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/register" element={<RegisterComponent />} />
          <Route path="/login" element={<LoginComponent />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          {/* Dashboard: auth‑only (permission=null) */}
          <Route element={<ProtectedRoute permission={null} />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
          {/* Admin‑only pages */}
          <Route element={<ProtectedRoute permission="view_users" />}>
            <Route path="/users" element={<AllUserForAdmin />} />
            <Route path="/users/:id/edit" element={<UpdateUserInfo />}/>
          </Route>
          {/* Attendance */}
          <Route element={<ProtectedRoute permission="mark_attendance" />}>
            <Route path="/MarkAttendance" element={<MarkAttendance />} />
          </Route>
          <Route element={<ProtectedRoute permission="view_own_attendance" />}>
            <Route path="ViewMyAttendance" element={<ViewMyAttendance />} />
          </Route>
          s
          <Route element={<ProtectedRoute permission="view_attendance" />}>
            <Route
              path="/StudentListForAttendance"
              element={<StudentListForAttendance />}
            />
            <Route
              path="/attendance/:id/"
              element={<StudentAttendance />}
            />
          </Route>
          {/* Leaves */}
          <Route element={<ProtectedRoute permission="request_leave" />}>
            <Route path="/LeaveRequest" element={<LeaveRequest />} />
          </Route>
          <Route element={<ProtectedRoute permission="view_own_leaves" />}>
            <Route path="StudentRequestList" element={<StudentRequestList />} />
          </Route>
          <Route element={<ProtectedRoute permission="approve_leave" />}>
            <Route path="/leaves/all" element={<RequestListAdmin />} />
          </Route>
          {/* Tasks */}
          <Route element={<ProtectedRoute permission="assign_task" />}>
            <Route path="/tasks/assign" element={<AssignTask />} />
            <Route path="/AssignedTasks" element={<AssignedTasks />} />
            <Route path="/tasks/:taskId/edit" element={<EditTask />} />
          </Route>
          <Route element={<ProtectedRoute permission="submit_task" />}>
            <Route path="/tasks/mine" element={<StudentTasksList />} />
            <Route path="/TaskSubmission/:taskId" element={<TaskSubmission />} />
          </Route>
          {/* Profile */}
          <Route element={<ProtectedRoute permission="edit_profile" />}>
            <Route path="/Profile" element={<Profile />} />
            <Route path="/UpdateProfile" element={<UpdateProfile />} />
          </Route>
          {/* Roles & Permissions (Admin) */}
          <Route element={<ProtectedRoute permission="manage_roles" />}>
            <Route path="/roles" element={<RolePermissionManagement />} />
          </Route>
          {/* Catch‑all */}
          <Route path="*" element={<Unauthorized />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

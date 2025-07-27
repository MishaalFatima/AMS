// frontend/src/routesConfig.js

import React from "react";
import Dashboard        from "./components/Dashboard.jsx";
import AllUsers         from "./components/admin/AllUserForAdmin.jsx";
import MarkAttendance   from "./components/student/MarkAttendance.jsx";
import AttendanceAll    from "./components/admin/StudentListForAttendance.jsx";
import AttendanceMine   from "./components/student/ViewAttendance.jsx";
import RequestLeave     from "./components/student/LeaveRequest.jsx";
import LeavesMine       from "./components/student/StudentRequestList.jsx";
import LeavesAll        from "./components/admin/RequestListAdmin.jsx";
import AssignTask       from "./components/admin/AssignTask.jsx";
import MyTasks          from "./components/student/StudentTasksList.jsx";
import PendingTasks     from "./components/admin/AssignedTasks.jsx";
import EditTask         from "./components/admin/EditTask.jsx";
import Profile          from "./components/student/Profile.jsx";
import RolesPage        from "./components/admin/RolePermissionManagement.jsx";

// Central route + permission config
export const appRoutes = [
  { path: "/dashboard",         label: "Dashboard",            element: <Dashboard />,            perm: "view-dashboard" },
  { path: "/users",             label: "All Users",           element: <AllUsers />,             perm: "view_users" },
  { path: "/attendance/mark",   label: "Mark Attendance",     element: <MarkAttendance />,        perm: "mark_attendance" },
  { path: "/attendance/all",    label: "Attendance Records",  element: <AttendanceAll />,         perm: "view_attendance" },
  { path: "/attendance/mine",   label: "My Attendance",       element: <AttendanceMine />,        perm: "view_own_attendance" },
  { path: "/leaves/request",    label: "Request Leave",       element: <RequestLeave />,          perm: "request_leave" },
  { path: "/leaves/mine",       label: "My Leave Status",     element: <LeavesMine />,            perm: "view_own_leaves" },
  { path: "/leaves/all",        label: "Approve Leaves",      element: <LeavesAll />,             perm: "approve_leave" },
  { path: "/tasks/assign",      label: "Assign Task",         element: <AssignTask />,            perm: "assign_task" },
  { path: "/tasks/mine",        label: "My Tasks",            element: <MyTasks />,               perm: "submit_task" },
  { path: "/tasks/pending",     label: "Approve Tasks",       element: <PendingTasks />,          perm: "approve_task" },
  { path: "/tasks/:taskId/edit",label: "Edit Task",           element: <EditTask />,              perm: "approve_task" },
  { path: "/profile",           label: "My Profile",          element: <Profile />,               perm: "edit_profile" },
  { path: "/roles",             label: "Roles & Permissions", element: <RolesPage />,             perm: "manage_roles" },
];

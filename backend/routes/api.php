<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\LeaveController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\RolePermissionController;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Public routes: registration and login
| Protected routes: everything under Sanctum token auth
|
*/

//
// PUBLIC
//
Route::get('/public/roles', [RolePermissionController::class, 'listRoles']);
Route::post('/register', [UserController::class, 'register']);
Route::post('/login',    [UserController::class, 'login']);

//
// PROTECTED (requires a valid Sanctum token in Authorization: Bearer <token>)
//
Route::middleware('auth:sanctum')->group(function () {
     

     // Single /api/user that returns both the user and a flat permissions array
    Route::get('/user', function (Request $request) {
        // 1) eager‑load roles
        $user = $request->user()->load('roles');

        // 2) collect ALL permissions (direct + via roles)
        $permissions = $user
            ->getAllPermissions()
            ->pluck('name')
            ->toArray();

        // 3) return unified JSON
        return response()->json([
            'user'        => $user,
            'permissions' => $permissions,
        ]);
    });

    // Attendance marking
    Route::post('/attendance', [AttendanceController::class, 'store'])
         ->middleware('permission:mark_attendance');
    Route::get('/attendance/today', [AttendanceController::class, 'today'])
         ->middleware('permission:mark_attendance');

     // Own history: students view their own attendance history
    Route::get(
        '/attendance/history',
        [AttendanceController::class, 'history']
    )->middleware('permission:view_own_attendance');

    // Any user’s history: admins view per‑student logs

    Route::get(
        '/users',
        [UserController::class, 'list']
    )->middleware('permission:view_attendance');

    Route::get(
        '/attendance/{userId}/history',
        [AttendanceController::class, 'historyForUser']
    )->middleware('permission:view_attendance');


    // Student: submit a new leave request
    Route::post(
        '/leaves',
        [LeaveController::class, 'store']
    )->middleware('permission:request_leave');

    // Student: view only their own leave requests
    Route::get(
        '/leaves/my-requests',
        [LeaveController::class, 'myRequests']
    )->middleware('permission:view_own_leaves');

    // Admin: view all leave requests
    Route::get(
        '/leaves',
        [LeaveController::class, 'index']
    )->middleware('permission:approve_leave');

    // Admin: approve or reject (you already have these)
    Route::patch(
        '/leaves/{id}/approve',
        [LeaveController::class, 'approve']
    )->middleware('permission:approve_leave');

    Route::patch(
        '/leaves/{id}/reject',
        [LeaveController::class, 'reject']
    )->middleware('permission:approve_leave');

    
    // Task assignment and status updates

    // Admin: assign a task to a student
    Route::post('/tasks', [TaskController::class, 'store'])
         ->middleware('permission:assign_task');
    Route::patch('/tasks/{task}/status', [TaskController::class, 'updateStatus'])
         ->middleware('permission:assign_task');

    // List all tasks (Admin view)
    Route::get('/taskList', [TaskController::class, 'index'])
    ->middleware('permission:assign_task');
    
    // Admin edits task metadata (title/description/due_date/status)
    Route::put('/tasks/{task}', [TaskController::class, 'updateTask'])
    ->middleware('permission:assign_task');

    // Student submits a completed task;
    Route::get('/tasks', [TaskController::class, 'ownTasks']
    )->middleware('permission:submit_task');
     Route::get('/tasks/{task}', [TaskController::class, 'show'])
         ->middleware('permission:submit_task|assign_task');
    Route::post('/tasks/{task}/submit', [TaskController::class, 'submit']
    )->middleware('permission:submit_task');
     
    
    // Admin deletes a task
    Route::delete('/tasks/{task}', [TaskController::class, 'destroy'])
    ->middleware('permission:assign_task');

    // GET all permissions
    Route::get('/permissions', [RolePermissionController::class, 'listPermissions'])
     ->middleware('permission:manage_roles');

     // GET all roles (with eager‑loaded perms)
     Route::get('/roles',       [RolePermissionController::class, 'listRoles'])
     ->middleware('permission:manage_roles');

     // PUT to update a role’s permissions
     Route::put('/roles/{role}/permissions',
     [RolePermissionController::class, 'updatePermissions'])
     ->middleware('permission:manage_roles');

     // POST to create a new role
     Route::post('/roles',      [RolePermissionController::class, 'createRole'])
     ->middleware('permission:manage_roles');


    // Expose user list (for frontend dropdown)
     Route::get(
        '/userList',
        [UserController::class, 'list']
    )->middleware('permission:view_users|assign_task');

     // View any single user’s profile (or “my profile” if you pass the logged‐in ID)
     Route::get(
        '/users/{id}',
        [UserController::class, 'show']
    )->middleware('permission:edit_profile|view_users');

    // Self‑edit: update own profile
    Route::post(
        '/user/{id}',
        [UserController::class, 'updateUser']
    )->middleware('permission:edit_profile|view_users');

    // Admin: delete a user
    Route::delete(
        '/user/{id}',
        [UserController::class, 'delete']
    )->middleware('permission:manage_roles');  
});
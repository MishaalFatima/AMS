<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Twilio\Rest\Client;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

// Spatie’s models
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolePermissionController extends Controller
{
    /**
     * GET /api/admin/roles
     * Return all roles with their attached permissions.
     */
    public function listRoles()
    {
        return Role::with('permissions')->get();
    }

    /**
     * GET /api/permissions
     * Return the master list of all permissions.
     */
    public function listPermissions()
    {
        return Permission::all(['id', 'name']);
    }

    /**
     * POST /api/admin/roles
     * Create a new role and return it.
     */
    public function createRole(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|unique:roles,name',
        ]);

          $role = Role::create([
            'name'       => $data['name'],
            'guard_name' => 'web',
        ]);
        return response()->json($role->load('permissions'), 201);
    }

    /**
     * PUT /api/admin/roles/{role}/permissions
     * Body payload: { permissions: [1,2,3] }
     */
        public function syncPermissions(Request $request, Role $role)
    {
        // 1) validate incoming IDs
        $data = $request->validate([
            'permissions'   => 'required|array',
            'permissions.*' => 'integer|exists:permissions,id',
        ]);

        // 2) sync pivot: role ↔ permissions
        $role->permissions()
             ->syncWithoutDetaching($data['permissions']);

        // 3) return the updated role (with its permissions loaded)
        return response()->json(
            $role->load('permissions'),
            200
        );
    }
    public function updatePermissions(Request $request, Role $role)
    {
        // 1) Validate that we have an array of existing permission IDs
        $validated = $request->validate([
            'permissions'   => 'required|array',
            'permissions.*' => 'integer|exists:permissions,id',
        ]);

        // 2) Sync pivot: remove any old, attach exactly these
        $role->permissions()->sync($validated['permissions']);

        // 3) Return updated role + its permissions
        return response()->json(
            $role->load('permissions'),
            200
        );
    }
}

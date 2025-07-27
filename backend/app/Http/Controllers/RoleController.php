<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;


class UserRoleController extends Controller
{
    public function assign(Request $request, User $user)
    {
        $data = $request->validate([
            'roles' => 'required|array'
        ]);

        $user->syncRoles($data['roles']);
        return response()->json($user->load('roles'));
    }
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Models\Role;


class UserController extends Controller
{
    /**
     * Register a new user, assign a role, and return the user
     * (with roles & permissions eager‑loaded) as JSON.
     */
    public function register(Request $req)
    {
        // 1) Validate incoming data
        $data = $req->validate([
            'UserName'             => 'required|string|max:255',
            'email'                => 'required|email|unique:users,email',
            'phone'                => 'nullable|string',
            'role_id'              => 'required|integer|exists:roles,id',
            'password'             => 'required|string|confirmed',
            'img_uri'              => 'nullable|image|max:2048',
        ]);

        // 2) Create & persist the User
        $user = new User();
        $user->UserName = $data['UserName'];
        $user->email    = $data['email'];
        $user->phone    = $data['phone'] ?? null;
        $user->password = Hash::make($data['password']);
        $user->role_id  = $data['role_id'];

        // 3) Handle avatar upload
        if ($req->hasFile('img_uri')) {
            $path = $req->file('img_uri')->store('user','public');
            $user->img_uri = pathinfo($path, PATHINFO_BASENAME);
        }

        $user->save();

        // 4) Assign the role by name (using the fetched Role model)
        $roleModel = Role::findOrFail($data['role_id']);
        $user->assignRole($roleModel->name);

        // 5) Eager‑load roles & permissions for JSON output
        $user->load('roles','permissions');

        // 6) Return the new user object
        return response()->json([
            'user' => $user,
        ], 201);
    }

    /**
     * Authenticate, issue a Sanctum token, and return
     * the user (with roles & permissions) + token.
     */

    public function login(Request $req)
    {
        // 1) Find user by username
        $user = User::where('UserName', $req->input('UserName'))->first();

        // 2) Verify credentials
        if (! $user || ! Hash::check($req->input('password'), $user->password)) {
            return response()->json([
                'message' => 'Username or password is incorrect',
            ], 401);
        }

        // 3) Issue Sanctum token
        $token = $user->createToken('api-token')->plainTextToken;

        // 4) Eager‑load roles so we know which roles this user has
        $user->load('roles');

        // 5) Build a flat array of all permission names (direct + via roles)
        $allPerms = $user
            ->getAllPermissions()   // Spatie method: direct + via roles
            ->pluck('name')         // Collection of Permission models → their names
            ->toArray();            // Convert to plain PHP array

        // 6) Return JSON payload
        return response()->json([
            'user'        => $user,
            'token'       => $token,
            'permissions' => $allPerms,
        ], 200);
    }
    /**
     * List all users (admin)
     */

     public function list()
    {
        return User::all();
    }

    public function show($id)
    {
        $user = User::with('roles','permissions')->findOrFail($id);

        // (Optional) if you only want users to see their own profile:
        // if (auth()->id() !== $user->id) {
        //     abort(403, 'Forbidden');
        // }
        
        return response()->json($user, 200);
    }

    /**
     * Update a user's profile (self‑only).
     */
    public function updateUser(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'UserName'    => 'required|string|max:255',
            'email'       => 'required|email|max:255|unique:users,email,'. $user->id,
            'phone'       => 'nullable|string|max:20',
            'role_id'     => 'required|integer|exists:roles,id',
            'img_uri'     => 'nullable|image|max:2048',
        ]);

        $user->UserName = $validated['UserName'];
        $user->email    = $validated['email'];
        $user->phone    = $validated['phone'] ?? null;
        $user->role_id  = $validated['role_id'];

        // sync Spatie roles
        $roleModel = Role::findOrFail($validated['role_id']);
        $user->syncRoles([$roleModel->name]);

        if ($request->hasFile('img_uri')) {
            if ($user->img_uri) {
                Storage::disk('public')->delete('user/'.$user->img_uri);
            }
            $path = $request->file('img_uri')->store('user','public');
            $user->img_uri = pathinfo($path, PATHINFO_BASENAME);
        }

        $user->save();

        // return with full URL for front‑end convenience
        $user->img_uri = $user->img_uri
            ? url("storage/user/{$user->img_uri}")
            : null;

        return response()->json($user, 200);
    }
    /**
     * Delete a user (admin).
     */
    public function delete($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json(['message' => 'User deleted successfully']);
    }
}

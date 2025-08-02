<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Config;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    public function run()
    {
        // use your default guard (usually "web")
        $guard = Config::get('auth.defaults.guard', 'web');

        // 1) Define every permission your NavBars check
        $permissions = [
            //student
            'view-dashboard',
            'mark_attendance',
            'view_own_attendance',
            'request_leave',
            'view_own_leaves',
            'submit_task',
            
            //both
            'edit_profile',
            
            //admin
            'view_users',
            'view_attendance',
            'approve_leave',
            'assign_task',
            'manage_roles',
        ];

        // 2) Create or update Permission records
        foreach ($permissions as $perm) {
            Permission::firstOrCreate(
                ['name' => $perm, 'guard_name' => $guard]
            );
        }

        // 3) Student role — only the student-side links
        $student = Role::firstOrCreate(
            ['name' => 'student', 'guard_name' => $guard]
        );
        $student->syncPermissions([
            'view-dashboard',
            'mark_attendance',
            'view_own_attendance',
            'request_leave',
            'view_own_leaves',
            'submit_task',
            'edit_profile',
        ]);

        // 4) Admin role — full access to everything
        $admin = Role::firstOrCreate(
            ['name' => 'admin', 'guard_name' => $guard]
        );
        $admin->syncPermissions([
            'edit_profile',
            'view_users',
            'view_attendance',
            'approve_leave',
            'assign_task',
            'manage_roles',
        ]);

        // (Optional) If you have a “teacher” or other roles, seed them here too…
    }
}

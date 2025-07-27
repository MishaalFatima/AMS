<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Config;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    public function run()
    {
        $guard = Config::get('auth.defaults.guard', 'web');

        // These two will be created if missing
        Role::firstOrCreate(
            ['name'       => 'student', 'guard_name' => $guard]
        );
        Role::firstOrCreate(
            ['name'       => 'admin',   'guard_name' => $guard]
        );
    }
}

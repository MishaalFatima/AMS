<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed roles and permissions
        $this->call([
            RolePermissionSeeder::class,
        RoleSeeder::class,
            // add other seeders here if needed
        ]);

        // Optionally, you can seed users or other data
        // \App\Models\User::factory(10)->create();
    }
}

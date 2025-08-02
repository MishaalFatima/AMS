<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();

            // From your form: UserName
            $table->string('UserName');

            // Email, unique
            $table->string('email')->unique();

            //  phone
            $table->string('phone');

            // Role (Student, Admin, etc.)
            $table->unsignedBigInteger('role_id');

            // Password
            $table->string('password');

            // Where we’ll store the uploaded image path
            $table->string('img_uri');

            // Laravel default
            $table->rememberToken();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};

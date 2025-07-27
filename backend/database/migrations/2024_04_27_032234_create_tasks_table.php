<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();

            // link to the users table
            $table->foreignId('student_id')
                  ->constrained('users')
                  ->onDelete('cascade');

            $table->string('title');
            $table->text('description');
            $table->date('due_date');

            // leave attachment null on assign; students submit later
            $table->string('submission_path')->nullable();

            $table->enum('status', ['pending','submitted','approved','rejected'])
                  ->default('pending');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};

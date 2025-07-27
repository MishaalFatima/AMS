<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('attendances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
            ->constrained()
            ->onDelete('cascade');
            // Only one timestamp – you can query its DATE() if needed
            $table->timestamp('marked_at')->useCurrent();
});

    }

    public function down(): void
    {
        Schema::dropIfExists('attendances');
    }
};

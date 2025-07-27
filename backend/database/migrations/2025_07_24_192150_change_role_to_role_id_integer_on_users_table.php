<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ChangeRoleToRoleIdIntegerOnUsersTable extends Migration
{
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            // add back as unsignedBigInteger FK
            $table->unsignedBigInteger('role_id')
                  ->nullable()
                  ->after('phone');
            // enforce FK constraint
            $table->foreign('role')
                  ->references('id')
                  ->on('roles')
                  ->onDelete('set null');
        });
    }

    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['role_id']);
            $table->dropColumn('role_id');
        });
    }
}


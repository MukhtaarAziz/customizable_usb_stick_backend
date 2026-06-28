<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('games', function (Blueprint $table) {
            $table->boolean('active')->default(true)->after('date_release');
        });

        Schema::table('programs', function (Blueprint $table) {
            $table->boolean('active')->default(true)->after('date_release');
        });
    }

    public function down(): void
    {
        Schema::table('games', function (Blueprint $table) {
            $table->dropColumn('active');
        });

        Schema::table('programs', function (Blueprint $table) {
            $table->dropColumn('active');
        });
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('games', function (Blueprint $table) {
            $table->renameColumn('size_gb', 'size_mb');
            $table->integer('size_mb')->change()->default(0);
        });

        Schema::table('programs', function (Blueprint $table) {
            $table->renameColumn('size_gb', 'size_mb');
            $table->integer('size_mb')->change()->default(0);
        });
    }

    public function down(): void
    {
        Schema::table('games', function (Blueprint $table) {
            $table->renameColumn('size_mb', 'size_gb');
            $table->double('size_gb', 8, 2)->change()->default(0.00);
        });

        Schema::table('programs', function (Blueprint $table) {
            $table->renameColumn('size_mb', 'size_gb');
            $table->double('size_gb', 8, 2)->change()->default(0.00);
        });
    }
};

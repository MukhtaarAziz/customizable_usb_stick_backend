<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('storage_devices', function (Blueprint $table) {
            $table->boolean('customizable')->default(false)->after('interface');
        });
    }

    public function down(): void
    {
        Schema::table('storage_devices', function (Blueprint $table) {
            $table->dropColumn('customizable');
        });
    }
};

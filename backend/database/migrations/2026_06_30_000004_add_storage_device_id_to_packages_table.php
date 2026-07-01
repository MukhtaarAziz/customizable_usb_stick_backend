<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('packages', function (Blueprint $table) {
            $table->foreignId('storage_device_id')
                ->nullable()
                ->after('package_category_type_id')
                ->constrained('storage_devices')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('packages', function (Blueprint $table) {
            $table->dropForeign(['storage_device_id']);
            $table->dropColumn('storage_device_id');
        });
    }
};

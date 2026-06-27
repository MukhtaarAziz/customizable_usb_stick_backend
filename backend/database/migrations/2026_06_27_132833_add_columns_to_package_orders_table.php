<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('package_orders', function (Blueprint $table) {
            $table->string('customer_name')->nullable()->after('customer_id');
            $table->foreignId('governorate_id')->nullable()->constrained()->nullOnDelete()->after('customer_name');
        });
    }

    public function down(): void
    {
        Schema::table('package_orders', function (Blueprint $table) {
            $table->dropForeign(['governorate_id']);
            $table->dropColumn(['customer_name', 'governorate_id']);
        });
    }
};

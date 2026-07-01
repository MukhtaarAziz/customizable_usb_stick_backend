<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::dropIfExists('package_order_statuses');
    }

    public function down(): void
    {
        Schema::create('package_order_statuses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('package_order_id')->constrained()->cascadeOnDelete();
            $table->string('status');
            $table->timestamps();
        });
    }
};

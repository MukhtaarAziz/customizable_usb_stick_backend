<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('packages', function (Blueprint $table) {
            $table->id();
            $table->string('name_en');
            $table->string('name_ar');
            $table->text('description_en')->nullable();
            $table->text('description_ar')->nullable();
            $table->foreignId('platform_id')->constrained('platforms')->cascadeOnDelete();
            $table->foreignId('package_category_type_id')->constrained('package_category_types')->cascadeOnDelete();
            $table->boolean('active')->default(true);
            $table->decimal('price_iqd', 10, 2)->default(0);
            $table->decimal('discount', 3, 2)->default(0.00);
            $table->unsignedBigInteger('views')->default(0);
            $table->unsignedBigInteger('order_count')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('packages');
    }
};

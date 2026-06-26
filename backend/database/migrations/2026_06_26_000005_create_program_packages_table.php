<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('program_packages', function (Blueprint $table) {
            $table->id();
            $table->string('name_en');
            $table->text('description_en')->nullable();
            $table->string('name_ar');
            $table->text('description_ar')->nullable();
            $table->foreignId('cover_id')->nullable()->constrained('program_images')->nullOnDelete();
            $table->foreignId('program_platform_id')->constrained('program_platforms')->cascadeOnDelete();
            $table->unsignedBigInteger('views')->default(0);
            $table->unsignedBigInteger('order_count')->default(0);
            $table->timestamps();
        });

        Schema::create('program_package', function (Blueprint $table) {
            $table->id();
            $table->foreignId('program_id')->constrained()->cascadeOnDelete();
            $table->foreignId('program_package_id')->constrained('program_packages')->cascadeOnDelete();
            $table->unique(['program_id', 'program_package_id']);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('program_package');
        Schema::dropIfExists('program_packages');
    }
};

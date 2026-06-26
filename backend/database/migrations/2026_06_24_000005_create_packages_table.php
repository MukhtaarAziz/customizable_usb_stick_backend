<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('game_packages', function (Blueprint $table) {
            $table->id();
            $table->string('name_en');
            $table->text('description_en')->nullable();
            $table->string('name_ar');
            $table->text('description_ar')->nullable();
            $table->foreignId('cover_id')->nullable()->constrained('game_images')->nullOnDelete();
            $table->foreignId('game_platform_id')->constrained('game_platforms')->cascadeOnDelete();
            $table->unsignedBigInteger('views')->default(0);
            $table->unsignedBigInteger('order_count')->default(0);
            $table->timestamps();
        });

        Schema::create('game_package', function (Blueprint $table) {
            $table->id();
            $table->foreignId('game_id')->constrained()->cascadeOnDelete();
            $table->foreignId('game_package_id')->constrained('game_packages')->cascadeOnDelete();
            $table->timestamps();
            $table->unique(['game_id', 'game_package_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('game_package');
        Schema::dropIfExists('game_packages');
    }
};

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
        Schema::create('games', function (Blueprint $table) {
            $table->id();
            $table->string('name_en');
            $table->text('description_en')->nullable();
            $table->string('name_ar');
            $table->text('description_ar')->nullable();
            $table->foreignId('category_id')->constrained('categories')->cascadeOnDelete();
            $table->foreignId('game_platform_id')->constrained('game_platforms')->cascadeOnDelete();
            $table->json('tags')->nullable();
            $table->double('size_gb', 8, 2)->default(0.00);
            $table->unsignedBigInteger('downloads')->default(0);
            $table->date('date_release')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('games');
    }
};

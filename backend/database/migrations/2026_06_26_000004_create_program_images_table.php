<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('program_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('program_id')->constrained()->onDelete('cascade');
            $table->string('path');
            $table->string('thumb_path')->nullable();
            $table->string('type')->nullable();
            $table->string('alt')->nullable();
            $table->integer('sort_order')->default(0);
            $table->string('mime')->nullable();
            $table->integer('size')->nullable();
            $table->string('disk')->default('local');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('program_images');
    }
};

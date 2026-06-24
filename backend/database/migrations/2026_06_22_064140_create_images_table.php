<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('game_id')->constrained()->onDelete('cascade');
            $table->string('path');
            $table->string('type')->nullable();
            $table->string('alt')->nullable();
            $table->integer('sort_order')->default(0);
            $table->string('mime')->nullable();
            $table->integer('size')->nullable();
            $table->string('disk')->default('local');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('images');
    }
};

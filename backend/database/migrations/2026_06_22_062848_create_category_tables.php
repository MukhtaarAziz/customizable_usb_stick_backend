<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('category_types', function (Blueprint $table) {
            $table->id();
            $table->string('name_en');
            $table->string('name_ar');
            $table->timestamps();
        });

        DB::table('category_types')->insert([
            ['id' => 1, 'name_en' => 'Game', 'name_ar' => 'لعبة'],
            ['id' => 2, 'name_en' => 'Program', 'name_ar' => 'برنامج'],
        ]);

        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_type_id')->constrained()->cascadeOnDelete();
            $table->string('name_en');
            $table->string('name_ar');
            $table->text('description_en')->nullable();
            $table->text('description_ar')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('categories');
        Schema::dropIfExists('category_types');
    }
};
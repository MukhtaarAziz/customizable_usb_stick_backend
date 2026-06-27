<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('storage_devices', function (Blueprint $table) {
            $table->id();
            $table->string('name_en');
            $table->string('name_ar');
            $table->text('description_en')->nullable();
            $table->text('description_ar')->nullable();
            $table->foreignId('storage_type_id')->constrained('storage_device_types')->cascadeOnDelete();
            $table->integer('size_mb'); // Nominal/advertised size in MB
            $table->integer('real_size_mb')->nullable(); // Actual usable size in MB
            $table->decimal('price_iqd', 12, 2); // Price in Iraqi Dinar
            $table->string('marka'); // Brand
            $table->string('interface'); // USB 2.0, USB 3.0, USB-C, SATA, etc.
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('storage_devices');
    }
};
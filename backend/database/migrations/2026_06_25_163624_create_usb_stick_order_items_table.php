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
        Schema::create('usb_stick_order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('usb_stick_order_id')->constrained()->cascadeOnDelete();
            $table->string('itemable_type'); // Game or Program
            $table->unsignedBigInteger('itemable_id');
            $table->timestamps();

            $table->index(['itemable_type', 'itemable_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('usb_stick_order_items');
    }
};
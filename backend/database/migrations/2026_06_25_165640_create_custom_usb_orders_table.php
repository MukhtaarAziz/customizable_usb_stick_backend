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
        Schema::create('custom_usb_orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->constrained()->cascadeOnDelete();
            $table->foreignId('usb_stick_id')->constrained()->cascadeOnDelete();
            $table->decimal('total_price', 10, 2)->default(0.00);
            $table->string('status')->default('pending'); // pending (قيد الانتظار), processing (قيد المعالجة), shipped (تم الإرسال), delivered (تم الاستلام), cancelled (ملغى)
            $table->text('notes')->nullable();
            $table->text('custom_message')->nullable(); // رسالة مخصصة للفلاش
            $table->string('delivery_address')->nullable();
            $table->string('phone')->nullable();
            $table->timestamps();
        });

        Schema::create('custom_usb_order_game', function (Blueprint $table) {
            $table->id();
            $table->foreignId('custom_usb_order_id')->constrained('custom_usb_orders')->cascadeOnDelete();
            $table->foreignId('game_id')->constrained()->cascadeOnDelete();
            $table->unique(['custom_usb_order_id', 'game_id']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('custom_usb_order_game');
        Schema::dropIfExists('custom_usb_orders');
    }
};
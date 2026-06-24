<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('usb_sticks', function (Blueprint $table) {
            $table->id();
            $table->string('name_en');
            $table->string('name_ar');
            $table->text('description_en')->nullable();
            $table->text('description_ar')->nullable();
            $table->double('size_gb', 8, 2)->default(2.00);
            $table->string('interface')->default('2.0');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('usb_sticks');
    }
};

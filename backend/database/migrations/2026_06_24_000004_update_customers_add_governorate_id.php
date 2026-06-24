<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('customers', function (Blueprint $table) {
            $table->foreignId('governorate_id')
                  ->after('email')
                  ->constrained('governorates')
                  ->onDelete('restrict');
            $table->dropColumn('governorate');
        });
    }

    public function down()
    {
        Schema::table('customers', function (Blueprint $table) {
            $table->string('governorate')->after('email');
            $table->dropConstrainedForeignId('governorate_id');
        });
    }
};

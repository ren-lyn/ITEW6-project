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
        Schema::table('schedules', function (Blueprint $table) {
            $table->string('schedule_type', 50)->default('Class');
            $table->string('title', 150)->nullable();
            $table->string('subject_code', 50)->nullable();
            $table->string('section', 50)->nullable();
            $table->string('year_level', 50)->nullable();
            $table->renameColumn('room', 'room_assignment');
            $table->renameColumn('day', 'days_of_week');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('schedules', function (Blueprint $table) {
            $table->dropColumn(['schedule_type', 'title', 'subject_code', 'section', 'year_level']);
            $table->renameColumn('room_assignment', 'room');
            $table->renameColumn('days_of_week', 'day');
        });
    }
};

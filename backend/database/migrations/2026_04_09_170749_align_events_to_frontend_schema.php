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
        Schema::table('events', function (Blueprint $table) {
            $table->renameColumn('event_name', 'name');
            $table->renameColumn('event_location', 'location');
            $table->string('status', 50)->default('Upcoming')->nullable();
            $table->json('participant_requirements_json')->nullable();
            $table->string('event_code', 50)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->dropColumn(['status', 'participant_requirements_json', 'event_code']);
            $table->renameColumn('name', 'event_name');
            $table->renameColumn('location', 'event_location');
        });
    }
};

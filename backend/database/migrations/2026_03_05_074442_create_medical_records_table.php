<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('medical_records', function (Blueprint $table) {
            $table->id('medical_id');
            $table->foreignId('student_id')->constrained('students', 'student_id')->cascadeOnDelete();
            $table->string('blood_type', 5)->nullable();
            $table->text('allergies')->nullable();
            $table->text('chronic_illness')->nullable();
            $table->string('disability', 100)->nullable();
            $table->text('psychological_evaluation')->nullable();
            $table->text('vaccination_record')->nullable();
            $table->boolean('activity_clearance')->default(true);
            $table->text('emergency_notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('medical_records');
    }
};

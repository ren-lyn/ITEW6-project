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
        Schema::create('materials', function (Blueprint $table) {
            $table->id();
            $table->foreignId('faculty_id')->nullable()->constrained('faculty', 'faculty_id')->nullOnDelete();
            $table->string('title');
            $table->string('type'); // Syllabus, Lesson, Curriculum
            $table->string('subject_code')->nullable();
            $table->text('description')->nullable();

            // Document grouping
            $table->json('syllabus_json')->nullable();
            $table->json('curriculum_json')->nullable();
            $table->json('lesson_json')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('materials');
    }
};

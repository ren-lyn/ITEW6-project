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
        Schema::create('guardians', function (Blueprint $table) {
            $table->id('guardian_id');
            $table->foreignId('student_id')->constrained('students', 'student_id')->cascadeOnDelete();
            $table->string('father_name', 100)->nullable();
            $table->string('father_occupation', 100)->nullable();
            $table->string('father_contact', 20)->nullable();
            $table->string('mother_name', 100)->nullable();
            $table->string('mother_occupation', 100)->nullable();
            $table->string('mother_contact', 20)->nullable();
            $table->string('guardian_name', 100)->nullable();
            $table->string('guardian_contact', 20)->nullable();
            $table->string('emergency_contact', 20)->nullable();
            $table->string('family_income_bracket', 50)->nullable();
            $table->string('living_status', 50)->nullable();
            $table->timestamps();
        });

        Schema::create('academic_records', function (Blueprint $table) {
            $table->id('record_id');
            $table->foreignId('student_id')->constrained('students', 'student_id')->cascadeOnDelete();
            $table->string('course', 50)->nullable();
            $table->integer('year_level')->nullable();
            $table->string('section', 20)->nullable();
            $table->string('semester', 20)->nullable();
            $table->decimal('gpa', 3, 2)->nullable();
            $table->decimal('gwa', 3, 2)->nullable();
            $table->string('academic_standing', 50)->nullable();
            $table->boolean('dean_list')->default(false);
            $table->string('scholarship', 50)->nullable();
            $table->integer('failed_subjects')->default(0);
            $table->string('retention_status', 50)->nullable();
            $table->foreignId('adviser_id')->nullable()->constrained('faculty', 'faculty_id')->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('skills', function (Blueprint $table) {
            $table->id('skill_id');
            $table->string('skill_name', 100);
            $table->string('skill_type', 50)->nullable();
            $table->timestamps();
        });

        Schema::create('student_skills', function (Blueprint $table) {
            $table->id('student_skill_id');
            $table->foreignId('student_id')->constrained('students', 'student_id')->cascadeOnDelete();
            $table->foreignId('skill_id')->constrained('skills', 'skill_id')->cascadeOnDelete();
            $table->integer('proficiency_level')->nullable();
            $table->timestamps();
        });

        Schema::create('talents', function (Blueprint $table) {
            $table->id('talent_id');
            $table->string('talent_name', 100);
            $table->timestamps();
        });

        Schema::create('student_talents', function (Blueprint $table) {
            $table->id('student_talent_id');
            $table->foreignId('student_id')->constrained('students', 'student_id')->cascadeOnDelete();
            $table->foreignId('talent_id')->constrained('talents', 'talent_id')->cascadeOnDelete();
            $table->timestamps();
        });

        Schema::create('organizations', function (Blueprint $table) {
            $table->id('org_id');
            $table->string('org_name', 150);
            $table->timestamps();
        });

        Schema::create('student_organizations', function (Blueprint $table) {
            $table->id('student_org_id');
            $table->foreignId('student_id')->constrained('students', 'student_id')->cascadeOnDelete();
            $table->foreignId('org_id')->constrained('organizations', 'org_id')->cascadeOnDelete();
            $table->string('position', 100)->nullable();
            $table->string('years_active', 50)->nullable();
            $table->timestamps();
        });

        Schema::create('behavioral_profiles', function (Blueprint $table) {
            $table->id('behavior_id');
            $table->foreignId('student_id')->constrained('students', 'student_id')->cascadeOnDelete();
            $table->decimal('attendance_percentage', 5, 2)->nullable();
            $table->integer('punctuality_rating')->nullable();
            $table->integer('faculty_evaluation')->nullable();
            $table->integer('peer_evaluation')->nullable();
            $table->text('counselor_remarks')->nullable();
            $table->string('personality_type', 50)->nullable();
            $table->integer('confidence_level')->nullable();
            $table->integer('communication_rating')->nullable();
            $table->timestamps();
        });

        Schema::create('physical_profiles', function (Blueprint $table) {
            $table->id('profile_id');
            $table->foreignId('student_id')->constrained('students', 'student_id')->cascadeOnDelete();
            $table->decimal('height', 5, 2)->nullable();
            $table->decimal('weight', 5, 2)->nullable();
            $table->string('body_measurements', 50)->nullable();
            $table->string('dress_size', 10)->nullable();
            $table->string('shoe_size', 10)->nullable();
            $table->boolean('stage_presence')->default(false);
            $table->boolean('represent_ccs')->default(false);
            $table->text('availability_schedule')->nullable();
            $table->timestamps();
        });

        Schema::create('event_participants', function (Blueprint $table) {
            $table->id('participant_id');
            $table->foreignId('event_id')->constrained('events', 'event_id')->cascadeOnDelete();
            $table->foreignId('student_id')->constrained('students', 'student_id')->cascadeOnDelete();
            $table->string('role', 100)->nullable();
            $table->timestamps();
        });

        Schema::create('research_authors', function (Blueprint $table) {
            $table->id('author_id');
            $table->foreignId('research_id')->constrained('research', 'research_id')->cascadeOnDelete();
            $table->foreignId('student_id')->constrained('students', 'student_id')->cascadeOnDelete();
            $table->timestamps();
        });

        Schema::create('courses', function (Blueprint $table) {
            $table->id('course_id');
            $table->string('course_code', 20)->unique();
            $table->string('course_title', 150);
            $table->text('description')->nullable();
            $table->timestamps();
        });

        Schema::create('syllabus', function (Blueprint $table) {
            $table->id('syllabus_id');
            $table->foreignId('course_id')->constrained('courses', 'course_id')->cascadeOnDelete();
            $table->foreignId('faculty_id')->nullable()->constrained('faculty', 'faculty_id')->nullOnDelete();
            $table->text('learning_outcomes')->nullable();
            $table->text('assessment_methods')->nullable();
            $table->timestamps();
        });

        Schema::create('lessons', function (Blueprint $table) {
            $table->id('lesson_id');
            $table->foreignId('syllabus_id')->constrained('syllabus', 'syllabus_id')->cascadeOnDelete();
            $table->string('lesson_title', 200)->nullable();
            $table->text('objectives')->nullable();
            $table->text('materials')->nullable();
            $table->text('assignments')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lessons');
        Schema::dropIfExists('syllabus');
        Schema::dropIfExists('courses');
        Schema::dropIfExists('research_authors');
        Schema::dropIfExists('event_participants');
        Schema::dropIfExists('physical_profiles');
        Schema::dropIfExists('behavioral_profiles');
        Schema::dropIfExists('student_organizations');
        Schema::dropIfExists('organizations');
        Schema::dropIfExists('student_talents');
        Schema::dropIfExists('talents');
        Schema::dropIfExists('student_skills');
        Schema::dropIfExists('skills');
        Schema::dropIfExists('academic_records');
        Schema::dropIfExists('guardians');
    }
};

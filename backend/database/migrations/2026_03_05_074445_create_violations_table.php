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
        Schema::create('violations', function (Blueprint $table) {
            $table->id('violation_id');
            $table->foreignId('student_id')->constrained('students', 'student_id')->cascadeOnDelete();
            $table->string('violation_type', 100)->nullable();
            $table->date('violation_date')->nullable();
            $table->string('severity_level', 50)->nullable();
            $table->text('sanction')->nullable();
            $table->string('case_status', 50)->nullable();
            $table->text('remarks')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('violations');
    }
};

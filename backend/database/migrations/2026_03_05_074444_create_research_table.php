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
        Schema::create('research', function (Blueprint $table) {
            $table->id('research_id');
            $table->string('title', 255)->nullable();
            $table->string('category', 100)->nullable();
            $table->text('abstract')->nullable();
            $table->year('publication_year')->nullable();
            $table->foreignId('adviser_id')->nullable()->constrained('faculty', 'faculty_id')->nullOnDelete();
            $table->string('research_file', 255)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('research');
    }
};

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
        Schema::table('verification_logs', function (Blueprint $table) {
            $table->foreignId('document_submission_id')->nullable()->change();
            $table->foreignId('user_id')->nullable()->after('document_submission_id')->constrained('users')->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('verification_logs', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropColumn('user_id');
            $table->foreignId('document_submission_id')->nullable(false)->change();
        });
    }
};

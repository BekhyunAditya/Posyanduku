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
        Schema::create('consultation_notes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('child_id')->constrained('children')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('posyandu_schedule_id')->nullable()->constrained('posyandu_schedules')->nullOnDelete();
            $table->string('title')->nullable();
            $table->text('eating_pattern_notes')->nullable();
            $table->text('questions');
            $table->text('follow_up_plan')->nullable();
            $table->date('noted_at')->nullable();
            $table->timestamps();

            $table->index(['child_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('consultation_notes');
    }
};

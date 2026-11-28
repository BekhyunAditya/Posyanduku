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
        Schema::create('posyandu_visits', function (Blueprint $table) {
            $table->id();
            $table->foreignId('child_id')->constrained('children')->cascadeOnDelete();
            $table->foreignId('posyandu_schedule_id')->nullable()->constrained('posyandu_schedules')->nullOnDelete();
            $table->foreignId('kader_id')->nullable()->constrained('users')->nullOnDelete();
            $table->date('visited_at');
            $table->string('attendance_status', 30)->default('hadir');
            $table->json('services_provided')->nullable();
            $table->text('service_notes')->nullable();
            $table->boolean('needs_follow_up')->default(false);
            $table->text('follow_up_notes')->nullable();
            $table->timestamp('follow_up_resolved_at')->nullable();
            $table->timestamps();

            $table->index(['child_id', 'visited_at']);
            $table->index(['needs_follow_up', 'follow_up_resolved_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('posyandu_visits');
    }
};

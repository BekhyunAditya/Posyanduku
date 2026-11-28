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
        Schema::create('who_growth_standards', function (Blueprint $table) {
            $table->id();
            $table->string('indicator', 10);
            $table->string('gender', 1);
            $table->unsignedSmallInteger('age_months')->nullable();
            $table->decimal('length_cm', 5, 1)->nullable();
            $table->decimal('sd_minus_3', 6, 2);
            $table->decimal('sd_minus_2', 6, 2);
            $table->decimal('sd_minus_1', 6, 2);
            $table->decimal('median', 6, 2);
            $table->decimal('sd_plus_1', 6, 2);
            $table->decimal('sd_plus_2', 6, 2);
            $table->decimal('sd_plus_3', 6, 2);
            $table->timestamps();

            $table->unique(['indicator', 'gender', 'age_months', 'length_cm'], 'who_standards_lookup_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('who_growth_standards');
    }
};

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
        Schema::table('users', function (Blueprint $table) {
            $table->string('role', 30)->default('orang_tua')->after('password')->index();
            $table->string('phone', 30)->nullable()->after('role');
            $table->foreignId('posyandu_id')->nullable()->after('phone')->constrained('posyandus')->nullOnDelete();
            $table->timestamp('kader_verified_at')->nullable()->after('posyandu_id');
            $table->boolean('is_active')->default(true)->after('kader_verified_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropConstrainedForeignId('posyandu_id');
            $table->dropIndex(['role']);
            $table->dropColumn(['role', 'phone', 'kader_verified_at', 'is_active']);
        });
    }
};

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
        Schema::create('tickets', function (Blueprint $table) {
            $table->id();
            $table->string('ticket_number')->unique();

            $table->foreignId('user_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->foreignId('category_id')
                ->constrained('ticket_categories');

            $table->foreignId('sla_id')
                ->nullable()
                ->constrained('sla');

            $table->string('title');
            $table->text('description');
            $table->string('location');

            $table->enum('priority', ['low', 'medium', 'high']);

            $table->enum('status', [
                'submitted',
                'processed',
                'repairing',
                'done',
                'rejected'
            ])->default('submitted');

            $table->foreignId('assigned_to')
                ->nullable()
                ->references('id')
                ->on('users');

            $table->timestamp('responded_at')->nullable();
            $table->timestamp('resolved_at')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tickets');
    }
};

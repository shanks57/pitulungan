<?php

use App\Models\Ticket;
use App\Models\User;
use App\Models\TicketCategory;

it('returns a PDF download for performance report when DOMPDF is available', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $tech = User::factory()->create(['role' => 'technician']);
    $category = TicketCategory::create(['name' => 'General']);

    Ticket::create([
        'ticket_number' => 'T-1',
        'user_id' => $admin->id,
        'category_id' => $category->id,
        'title' => 'Slow ticket',
        'description' => 'x',
        'location' => 'a',
        'priority' => 'medium',
        'status' => 'done',
        'assigned_to' => $tech->id,
        'created_at' => now()->subDays(10),
        'resolved_at' => now()->subDays(2),
    ]);

    $response = $this->actingAs($admin)->get('/admin/reports/performance?format=pdf');

    // If DOMPDF is not installed the app returns 501 with an instruction; treat that as acceptable but surfaced.
    if ($response->getStatusCode() === 501) {
        $response->assertJsonFragment(['error' => 'PDF generator not installed. Run `composer require barryvdh/laravel-dompdf` to enable PDF export.']);
        return;
    }

    $response->assertStatus(200);
    $response->assertHeader('Content-Type');
    $ct = $response->headers->get('content-type');
    expect($ct)->toContain('pdf');
});

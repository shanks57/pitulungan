<?php

use App\Models\Ticket;
use App\Models\User;
use App\Models\TicketCategory;

it('renders performance report html and includes technician metrics', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $tech = User::factory()->create(['role' => 'technician']);
    $category = TicketCategory::create(['name' => 'General']);

    // create resolved tickets with different durations
    $t1 = Ticket::create([
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

    $t2 = Ticket::create([
        'ticket_number' => 'T-2',
        'user_id' => $admin->id,
        'category_id' => $category->id,
        'title' => 'Quick ticket',
        'description' => 'y',
        'location' => 'b',
        'priority' => 'low',
        'status' => 'done',
        'assigned_to' => $tech->id,
        'created_at' => now()->subDays(3),
        'resolved_at' => now()->subDays(2)->addHours(6),
    ]);

    $response = $this->actingAs($admin)->get('/admin/reports/performance?format=html');
    $response->assertStatus(200);
    $response->assertSee('Performance report');
    $response->assertSee($tech->name);
    $response->assertSee('Average (hours)');
});

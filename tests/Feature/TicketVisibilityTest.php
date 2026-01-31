<?php

use App\Models\Ticket;
use App\Models\User;
use App\Models\TicketCategory;

it('regular user can see site-wide active tickets and view them but not other users\' done tickets', function () {
    $userA = User::factory()->create(['role' => 'user']);
    $userB = User::factory()->create(['role' => 'user']);

    $category = TicketCategory::create(['name' => 'General']);

    $activeTicket = Ticket::create([
        'ticket_number' => 'T-ACTIVE',
        'user_id' => $userB->id,
        'category_id' => $category->id,
        'title' => 'Active ticket by other',
        'description' => 'Active',
        'location' => 'Office',
        'priority' => 'medium',
        'status' => 'processed',
    ]);

    $doneTicket = Ticket::create([
        'ticket_number' => 'T-DONE',
        'user_id' => $userB->id,
        'category_id' => $category->id,
        'title' => 'Done ticket by other',
        'description' => 'Done',
        'location' => 'Office',
        'priority' => 'low',
        'status' => 'done',
    ]);

    $ownDone = Ticket::create([
        'ticket_number' => 'T-OWN-DONE',
        'user_id' => $userA->id,
        'category_id' => $category->id,
        'title' => 'My done ticket',
        'description' => 'Mine',
        'location' => 'Office',
        'priority' => 'low',
        'status' => 'done',
    ]);

    // Index: should see active ticket from other user, but not other's done ticket
    $this->actingAs($userA)
        ->get('/user/tickets')
        ->assertSee('Active ticket by other')
        ->assertDontSee('Done ticket by other');

    // Show: active ticket by other -> allowed
    $this->actingAs($userA)
        ->get("/user/tickets/{$activeTicket->id}")
        ->assertStatus(200);

    // Show: done ticket by other -> forbidden
    $this->actingAs($userA)
        ->get("/user/tickets/{$doneTicket->id}")
        ->assertStatus(403);

    // Show: own done ticket -> allowed
    $this->actingAs($userA)
        ->get("/user/tickets/{$ownDone->id}")
        ->assertStatus(200);
});

it('admin and technician can view tickets with any status', function () {
    $owner = User::factory()->create(['role' => 'user']);
    $admin = User::factory()->create(['role' => 'admin']);
    $tech = User::factory()->create(['role' => 'technician']);

    $category = TicketCategory::create(['name' => 'General']);

    $doneTicket = Ticket::create([
        'ticket_number' => 'T-DONE-2',
        'user_id' => $owner->id,
        'category_id' => $category->id,
        'title' => 'Done ticket owned by someone',
        'description' => 'Done',
        'location' => 'Office',
        'priority' => 'low',
        'status' => 'done',
    ]);

    $this->actingAs($admin)
        ->get("/admin/tickets/{$doneTicket->id}")
        ->assertStatus(200);

    $this->actingAs($tech)
        ->get("/admin/tickets/{$doneTicket->id}")
        ->assertStatus(200);
});

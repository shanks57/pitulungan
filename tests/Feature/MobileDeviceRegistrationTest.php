<?php

use App\Models\User;
use App\Models\MobileDevice;

it('registers and unregisters mobile device tokens', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->postJson('/mobile/devices', [
            'token' => 'token-123',
            'platform' => 'android',
            'app_version' => '1.2.3',
        ])
        ->assertStatus(201)
        ->assertJson(['status' => 'registered']);

    $this->assertDatabaseHas('mobile_devices', [
        'user_id' => $user->id,
        'token' => 'token-123',
        'platform' => 'android',
    ]);

    $this->actingAs($user)
        ->postJson('/mobile/devices/unregister', ['token' => 'token-123'])
        ->assertStatus(200)
        ->assertJson(['status' => 'unregistered']);

    $this->assertDatabaseMissing('mobile_devices', ['token' => 'token-123']);
});

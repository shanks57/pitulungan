<?php

use App\Models\User;
use App\Models\MobileDevice;
use App\Notifications\TicketCreatedWebPush;

it('routes mobile device tokens to FCM channel', function () {
    $user = User::factory()->create();
    MobileDevice::create(['user_id' => $user->id, 'token' => 'tok-1', 'platform' => 'android']);
    MobileDevice::create(['user_id' => $user->id, 'token' => 'tok-2', 'platform' => 'ios']);

    $tokens = $user->routeNotificationForFcm();
    expect($tokens)->toBeArray()->toHaveCount(2)->toContain('tok-1');

    $n = new TicketCreatedWebPush((object)['id' => 1, 'ticket_number' => 'T-1', 'title' => 'x']);
    $via = $n->via($user);
    expect($via)->toContain(App\Notifications\Channels\FcmChannel::class);
});

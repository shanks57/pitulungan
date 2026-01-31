<?php

namespace App\Notifications\Channels;

use GuzzleHttp\Client as GuzzleClient;
use Illuminate\Notifications\Notification;

class FcmChannel
{
    protected $http;

    public function __construct(GuzzleClient $http = null)
    {
        $this->http = $http ?? new GuzzleClient();
    }

    public function send($notifiable, Notification $notification)
    {
        if (! method_exists($notification, 'toFcm')) {
            return;
        }

        $tokens = (array) $notifiable->routeNotificationForFcm();
        if (empty($tokens)) {
            return;
        }

        $payload = $notification->toFcm($notifiable);
        $body = [
            'registration_ids' => $tokens,
            'notification' => $payload['notification'] ?? [],
            'data' => $payload['data'] ?? [],
            'priority' => 'high',
        ];

        $serverKey = config('services.fcm.server_key');
        if (! $serverKey) {
            logger()->warning('FCM server key not configured, skipping mobile push.');
            return;
        }

        $this->http->post('https://fcm.googleapis.com/fcm/send', [
            'headers' => [
                'Authorization' => 'key=' . $serverKey,
                'Content-Type' => 'application/json',
            ],
            'body' => json_encode($body),
            'timeout' => 5,
        ]);
    }
}

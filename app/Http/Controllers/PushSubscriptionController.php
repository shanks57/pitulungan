<?php

namespace App\Http\Controllers;

use App\Models\PushSubscription;
use Illuminate\Http\Request;

class PushSubscriptionController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'endpoint' => 'required|url',
            'keys.p256dh' => 'required|string',
            'keys.auth' => 'required|string',
        ]);

        $payload = $request->all();

        $hash = hash('sha256', $payload['endpoint']);

        PushSubscription::updateOrCreate(
            ['endpoint_hash' => $hash],
            [
                'user_id' => $request->user()->id,
                'endpoint' => $payload['endpoint'],
                'endpoint_hash' => $hash,
                'public_key' => $payload['keys']['p256dh'],
                'auth_token' => $payload['keys']['auth'],
                'content_encoding' => $payload['contentEncoding'] ?? null,
            ]
        );

        return response()->json(['status' => 'subscribed'], 201);
    }

    public function destroy(Request $request)
    {
        $request->validate(['endpoint' => 'required|url']);

        $hash = hash('sha256', $request->input('endpoint'));

        PushSubscription::where('endpoint_hash', $hash)
            ->where('user_id', $request->user()->id)
            ->delete();

        return response()->json(['status' => 'unsubscribed']);
    }
}

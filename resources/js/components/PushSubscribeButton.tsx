import React, { useEffect, useState } from 'react';
import { usePushSubscription } from '@/hooks/use-push-subscription';

export function PushSubscribeButton({ vapidKey }: { vapidKey: string }) {
    const { supported, isSubscribed, subscribe, unsubscribe } = usePushSubscription();
    const [subscribed, setSubscribed] = useState(false);

    useEffect(() => {
        if (!supported) return;
        (async () => setSubscribed(await isSubscribed()))();
    }, [supported]);

    if (!supported) return <div className="text-sm text-muted">Notifikasi tidak didukung pada peramban ini.</div>;

    return subscribed ? (
        <button
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-gray-200 text-sm text-gray-700 hover:bg-gray-50"
            onClick={async () => { await unsubscribe(); setSubscribed(false); }}
        >
            Nonaktifkan Notifikasi
        </button>
    ) : (
        <button
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700"
            onClick={async () => { await subscribe(vapidKey); setSubscribed(true); }}
        >
            Aktifkan Notifikasi
        </button>
    );
}

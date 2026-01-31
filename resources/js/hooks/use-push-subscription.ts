export function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

export function usePushSubscription() {
    const supported = typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window;

    async function isSubscribed() {
        if (!supported) return false;
        const reg = await navigator.serviceWorker.ready;
        const sub = await reg.pushManager.getSubscription();
        return !!sub;
    }

    async function subscribe(vapidKey: string) {
        if (!supported) throw new Error('Push tidak didukung di peramban ini.');
        const reg = await navigator.serviceWorker.ready;
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') throw new Error('Izin notifikasi ditolak.');

        const sub = await reg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(vapidKey),
        });

        const csrfMeta = document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement | null;
        const csrf = csrfMeta?.content;
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (csrf) headers['X-CSRF-TOKEN'] = csrf;

        await fetch('/web-push/subscribe', {
            method: 'POST',
            credentials: 'same-origin',
            headers,
            body: JSON.stringify(sub.toJSON()),
        });

        return sub;
    }

    async function unsubscribe() {
        if (!supported) return;
        const reg = await navigator.serviceWorker.ready;
        const sub = await reg.pushManager.getSubscription();
        if (!sub) return;

        const csrfMeta2 = document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement | null;
        const csrf2 = csrfMeta2?.content;
        const headers2: Record<string, string> = { 'Content-Type': 'application/json' };
        if (csrf2) headers2['X-CSRF-TOKEN'] = csrf2;

        await fetch('/web-push/unsubscribe', {
            method: 'POST',
            credentials: 'same-origin',
            headers: headers2,
            body: JSON.stringify({ endpoint: sub.endpoint }),
        });

        await sub.unsubscribe();
    }

    return { supported, isSubscribed, subscribe, unsubscribe };
}

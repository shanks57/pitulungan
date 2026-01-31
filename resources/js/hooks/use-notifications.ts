import { useEffect, useState, useCallback } from 'react';

type NotificationItem = {
    id: string;
    type: string;
    data: any;
    read_at: string | null;
    created_at: string;
};

export function useNotifications() {
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const fetchNotifications = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch('/notifications', { credentials: 'same-origin' });
            if (!res.ok) throw new Error('Failed to load notifications');
            const json = await res.json();
            setNotifications(json.notifications || []);
            setUnreadCount(json.unread_count || 0);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const markRead = useCallback(async (id: string) => {
        try {
            await fetch(`/notifications/${id}/read`, {
                method: 'POST',
                credentials: 'same-origin',
                headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement).content },
            });
            setNotifications((s) => s.map((n) => (n.id === id ? { ...n, read_at: new Date().toISOString() } : n)));
            setUnreadCount((c) => Math.max(0, c - 1));
        } catch (err) {
            console.error(err);
        }
    }, []);

    const markAllRead = useCallback(async () => {
        try {
            await fetch('/notifications/mark-all-read', {
                method: 'POST',
                credentials: 'same-origin',
                headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement).content },
            });
            setNotifications((s) => s.map((n) => ({ ...n, read_at: new Date().toISOString() })));
            setUnreadCount(0);
        } catch (err) {
            console.error(err);
        }
    }, []);

    useEffect(() => {
        fetchNotifications();

        // Listen for service worker messages (push received while client open)
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.addEventListener('message', (ev: any) => {
                const msg = ev.data;
                if (!msg) return;
                if (msg.type === 'push' && msg.payload) {
                    // refresh list (simple approach)
                    fetchNotifications();
                }
            });
        }

        // optional: poll every 60s
        const id = setInterval(fetchNotifications, 60000);
        return () => clearInterval(id);
    }, [fetchNotifications]);

    return { notifications, unreadCount, loading, fetchNotifications, markRead, markAllRead };
}

import { BellIcon, Check, X } from 'lucide-react';
import React, { Fragment, useState } from 'react';
import { useNotifications } from '@/hooks/use-notifications';

export function NotificationBell() {
    const { notifications, unreadCount, loading, markRead, markAllRead } = useNotifications();
    const [open, setOpen] = useState(false);

    return (
        <div className="relative">
            <button
                className="relative inline-flex items-center justify-center w-10 h-10 rounded-md hover:bg-gray-100"
                onClick={() => setOpen((s) => !s)}
                aria-label="Notifikasi"
                title="Notifikasi"
            >
                <BellIcon className="w-5 h-5 text-gray-600" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium leading-none text-white bg-red-600 rounded-full">{unreadCount}</span>
                )}
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-80 bg-white border rounded-lg shadow-lg z-50">
                    <div className="flex items-center justify-between px-4 py-2 border-b">
                        <div className="text-sm font-semibold">Notifikasi</div>
                        <div className="flex items-center gap-2">
                            <button className="text-xs text-gray-500 hover:text-gray-700" onClick={() => markAllRead()}>Tandai semua dibaca</button>
                        </div>
                    </div>

                    <div className="max-h-80 overflow-auto">
                        {loading && <div className="p-4 text-sm text-gray-500">Memuat...</div>}

                        {!loading && notifications.length === 0 && (
                            <div className="p-4 text-sm text-gray-500">Tidak ada notifikasi</div>
                        )}

                        {!loading && notifications.map((n) => (
                            <a
                                key={n.id}
                                href={n.data?.url || '#'}
                                className={`flex items-start gap-3 px-4 py-3 hover:bg-gray-50 ${n.read_at ? 'opacity-70' : 'bg-white'}`}
                                onClick={(e) => {
                                    // mark as read in background
                                    if (!n.read_at) markRead(n.id);
                                }}
                            >
                                <div className="w-10 h-10 rounded-md bg-blue-50 flex items-center justify-center text-blue-600">
                                    <BellIcon className="w-4 h-4" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="text-sm font-medium text-gray-900">{n.data?.title || 'Notifikasi'}</div>
                                        <div className="text-xs text-gray-400">{new Date(n.created_at).toLocaleString()}</div>
                                    </div>
                                    <div className="text-sm text-gray-600 mt-1">{n.data?.body || n.data?.summary || ''}</div>
                                </div>
                            </a>
                        ))}
                    </div>

                    <div className="px-4 py-2 border-t text-sm text-center">
                        <a href="/notifications" className="text-sm text-blue-600 hover:underline">Lihat semua notifikasi</a>
                    </div>
                </div>
            )}
        </div>
    );
}

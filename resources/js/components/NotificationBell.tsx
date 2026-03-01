import { BellIcon, Check, X } from 'lucide-react';
import React, { Fragment, useState } from 'react';
import { useNotifications } from '@/hooks/use-notifications';
import { PushSubscribeButton } from './PushSubscribeButton';

export function NotificationBell() {
    const { notifications, unreadCount, loading, markRead, markAllRead } = useNotifications();
    const [open, setOpen] = useState(false);

    return (
        <div className="relative">
            <button
                className="relative inline-flex items-center justify-center w-10 h-10 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 group"
                onClick={() => setOpen((s) => !s)}
                aria-label="Notifikasi"
                title="Notifikasi"
            >
                <BellIcon className="w-5 h-5 text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-blue-600 dark:bg-blue-500 text-[9px] font-black text-white shadow-lg shadow-blue-500/30 animate-in zoom-in duration-300">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <>
                    <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setOpen(false)} />
                    <div className="absolute right-0 mt-3 w-[calc(100vw-2rem)] sm:w-80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-50/50 to-transparent dark:from-blue-900/10 border-b border-slate-100 dark:border-slate-800">
                            <div className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">Notifikasi</div>
                            <button
                                className="text-[10px] font-black text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 uppercase tracking-widest px-2 py-1 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                                onClick={() => markAllRead()}
                            >
                                Baca Semua
                            </button>
                        </div>

                        <div className="max-h-[320px] overflow-y-auto custom-scrollbar">
                            {loading && (
                                <div className="p-8 text-center">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 dark:border-blue-400 mx-auto" />
                                    <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-tighter">Memuat...</p>
                                </div>
                            )}

                            {!loading && notifications.length === 0 && (
                                <div className="p-12 text-center">
                                    <BellIcon className="w-12 h-12 text-slate-200 dark:text-slate-800 mx-auto mb-3" />
                                    <p className="text-xs text-slate-400 dark:text-slate-600 font-bold uppercase tracking-tighter italic">Tidak ada notifikasi baru</p>
                                </div>
                            )}

                            {!loading && notifications.map((n) => (
                                <a
                                    key={n.id}
                                    href={n.data?.url || '#'}
                                    className={`flex items-start gap-4 px-6 py-4 transition-all duration-300 group border-b border-slate-50 dark:border-slate-800/50 last:border-0 ${n.read_at
                                            ? 'opacity-60 grayscale-[0.5]'
                                            : 'bg-white dark:bg-slate-900 hover:bg-blue-50/30 dark:hover:bg-blue-950/20'
                                        }`}
                                    onClick={(e) => {
                                        if (!n.read_at) markRead(n.id);
                                    }}
                                >
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 ${n.read_at
                                            ? 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                                            : 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shadow-sm'
                                        }`}>
                                        <BellIcon className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center justify-between gap-2">
                                            <div className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{n.data?.title || 'Notifikasi'}</div>
                                            {!n.read_at && <div className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-500 shadow-lg shadow-blue-500/40" />}
                                        </div>
                                        <div className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed font-medium">{n.data?.body || n.data?.summary || ''}</div>
                                        <div className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-tight pt-1">{new Date(n.created_at).toLocaleDateString()} • {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                    </div>
                                </a>
                            ))}
                        </div>

                        <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 space-y-4">
                            <PushSubscribeButton />
                            <div className="text-center pt-2">
                                <a href="/notifications" className="text-xs font-black text-blue-600 dark:text-blue-400 hover:underline uppercase tracking-widest">Lihat Semua</a>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

import { Link, usePage } from '@inertiajs/react';
import { resolveUrl } from '@/lib/utils';
import { type NavItem, type SharedData } from '@/types';
import { LayoutGrid, Tickets, Users2, Wrench, User, Settings } from 'lucide-react';

export default function MobileBottomNav() {
    const { auth } = usePage<SharedData>().props;
    const userRole = auth.user.role;
    const page = usePage();

    const baseNavItems: NavItem[] = [
        { title: 'Dasbor', href: '/dashboard', icon: LayoutGrid },
    ];

    const getRoleSpecificNavItems = (): NavItem[] => {
        switch (userRole) {
            case 'admin':
                return [
                    { title: 'Semua Tiket', href: '/admin/tickets', icon: Tickets },
                    { title: 'Pengguna', href: '/admin/users', icon: Users2 },
                ];
            case 'technician':
                return [
                    { title: 'Tiket Saya', href: '/admin/tickets?assigned_to=me', icon: Wrench },
                ];
            case 'user':
            default:
                return [
                    { title: 'Daftar Tiket', href: '/user/tickets', icon: User },
                    { title: 'Buat Tiket', href: '/tickets/create', icon: Tickets },
                ];
        }
    };

    const items = [
        ...baseNavItems,
        ...getRoleSpecificNavItems(),
        { title: 'Pengaturan', href: '/settings/profile', icon: Settings },
    ];

    return (
        <nav
            className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 shadow-2xl transition-colors duration-300"
            style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 0.5rem)' }}
            aria-label="Primary mobile navigation"
        >
            <div className="max-w-5xl mx-auto flex items-center justify-around px-2 py-3">
                {items.map((item) => {
                    const isActive = page.url.startsWith(resolveUrl(item.href));
                    const Icon = item.icon as any;
                    return (
                        <Link
                            key={item.title}
                            href={item.href}
                            className={`relative flex-1 flex flex-col items-center justify-center gap-1.5 transition-all duration-300 group ${isActive ? 'text-blue-600 dark:text-blue-400 scale-110' : 'text-slate-500 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-300'
                                }`}
                            aria-label={item.title}
                            title={item.title}
                            preserveScroll
                        >
                            {isActive && (
                                <span className="absolute -top-3 w-8 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 rounded-full shadow-[0_-4px_12px_rgba(37,99,235,0.4)] animate-pulse" />
                            )}
                            <div className={`p-1 rounded-lg transition-colors ${isActive ? 'bg-blue-50 dark:bg-blue-900/20' : 'group-hover:bg-slate-50 dark:group-hover:bg-slate-800'}`}>
                                <Icon className={`h-6 w-6 transition-transform ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                            </div>
                            <span className="sr-only">{item.title}</span>
                            <span className={`text-[10px] font-black uppercase tracking-tighter transition-all ${isActive ? 'opacity-100' : 'opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100'}`}>
                                {item.title}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}

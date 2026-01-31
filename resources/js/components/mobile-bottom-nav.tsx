import { Link, usePage } from '@inertiajs/react';
import { resolveUrl } from '@/lib/utils';
import { type NavItem, type SharedData } from '@/types';
import { LayoutGrid, Tickets, Users2, Wrench, User, Settings } from 'lucide-react';

export default function MobileBottomNav() {
    const { auth } = usePage<SharedData>().props;
    const userRole = auth.user.role;
    const page = usePage();

    const baseNavItems: NavItem[] = [
        { title: 'Dasbor', href: '/', icon: LayoutGrid },
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
                    { title: 'Tiket Saya', href: '/user/tickets', icon: User },
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
            className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur border-t border-gray-200 shadow-lg"
            style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 0.5rem)' }}
            aria-label="Primary mobile navigation"
        >
            <div className="max-w-5xl mx-auto flex items-center justify-between px-2 py-2">
                {items.map((item) => {
                    const isActive = page.url.startsWith(resolveUrl(item.href));
                    const Icon = item.icon as any;
                    return (
                        <Link
                            key={item.title}
                            href={item.href}
                            className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 text-sm transition-colors ${
                                isActive ? 'text-primary' : 'text-muted-foreground'
                            }`}
                            aria-label={item.title}
                            title={item.title}
                            preserveScroll
                        >
                            <Icon className="h-5 w-5" />
                            <span className="sr-only">{item.title}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}

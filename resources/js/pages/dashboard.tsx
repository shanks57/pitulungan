import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 p-6 rounded-xl">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-6">Dashboard</h1>
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="relative aspect-video overflow-hidden rounded-xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-md">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-blue-300/30" />
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50 shadow-md">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-indigo-300/30" />
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-md">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-emerald-300/30" />
                    </div>
                </div>
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border-2 border-blue-200 bg-gradient-to-br from-white to-blue-50 md:min-h-min shadow-lg mt-4">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-blue-300/20" />
                </div>
            </div>
        </AppLayout>
    );
}

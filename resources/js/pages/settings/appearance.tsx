import { Head } from '@inertiajs/react';

import AppearanceTabs from '@/components/appearance-tabs';
import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem } from '@/types';

import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit as editAppearance } from '@/routes/appearance';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Appearance settings',
        href: editAppearance().url,
    },
];

export default function Appearance() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Appearance settings" />

            <SettingsLayout>
                <div className="space-y-8 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-950 dark:via-blue-950/30 dark:to-purple-950 p-8 rounded-2xl transition-colors duration-300 shadow-xl dark:shadow-purple-900/10 border border-blue-100 dark:border-slate-800">
                    <div className="space-y-1">
                        <HeadingSmall
                            title="Pengaturan Tampilan"
                            description="Sesuaikan tema aplikasi sesuai kenyamanan mata Anda"
                        />
                    </div>

                    <div className="p-6 bg-white/60 dark:bg-slate-900/60 rounded-xl border border-blue-50 dark:border-slate-800">
                        <AppearanceTabs className="w-full sm:w-auto p-1.5 bg-blue-50/50 dark:bg-slate-950/50" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30">
                            <h4 className="text-xs font-black text-amber-900 dark:text-amber-400 uppercase tracking-widest mb-1">Mode Terang</h4>
                            <p className="text-[10px] text-amber-700 dark:text-amber-500/70 font-medium leading-relaxed">Memberikan tampilan bersih dan cerah, cocok untuk penggunaan di siang hari atau ruangan terang.</p>
                        </div>
                        <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/30">
                            <h4 className="text-xs font-black text-indigo-900 dark:text-indigo-400 uppercase tracking-widest mb-1">Mode Gelap</h4>
                            <p className="text-[10px] text-indigo-700 dark:text-indigo-500/70 font-medium leading-relaxed">Mengurangi kelelahan mata di malam hari dan menghemat baterai pada layar OLED.</p>
                        </div>
                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/10 border border-slate-100 dark:border-slate-800/50">
                            <h4 className="text-xs font-black text-slate-900 dark:text-slate-400 uppercase tracking-widest mb-1">Ikuti Sistem</h4>
                            <p className="text-[10px] text-slate-700 dark:text-slate-500/70 font-medium leading-relaxed">Secara otomatis menyesuaikan dengan pengaturan tema pada perangkat Anda.</p>
                        </div>
                    </div>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}

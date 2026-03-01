import HeadingSmall from '@/components/heading-small';
import TwoFactorRecoveryCodes from '@/components/two-factor-recovery-codes';
import TwoFactorSetupModal from '@/components/two-factor-setup-modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTwoFactorAuth } from '@/hooks/use-two-factor-auth';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { disable, enable, show } from '@/routes/two-factor';
import { type BreadcrumbItem } from '@/types';
import { Form, Head } from '@inertiajs/react';
import { ShieldBan, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

interface TwoFactorProps {
    requiresConfirmation?: boolean;
    twoFactorEnabled?: boolean;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Two-Factor Authentication',
        href: show.url(),
    },
];

export default function TwoFactor({
    requiresConfirmation = false,
    twoFactorEnabled = false,
}: TwoFactorProps) {
    const {
        qrCodeSvg,
        hasSetupData,
        manualSetupKey,
        clearSetupData,
        fetchSetupData,
        recoveryCodesList,
        fetchRecoveryCodes,
        errors,
    } = useTwoFactorAuth();
    const [showSetupModal, setShowSetupModal] = useState<boolean>(false);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Two-Factor Authentication" />
            <SettingsLayout>
                <div className="space-y-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950/30 dark:to-indigo-950 p-6 rounded-xl transition-colors duration-300">
                    <HeadingSmall
                        title="Autentikasi Dua Faktor (2FA)"
                        description="Kelola pengaturan keamanan akun Anda dengan lapisan verifikasi tambahan"
                    />
                    {twoFactorEnabled ? (
                        <div className="flex flex-col items-start justify-start space-y-4 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/20 p-8 rounded-2xl border border-emerald-200 dark:border-emerald-900/50 shadow-xl shadow-emerald-500/5 transition-all">
                            <Badge className="bg-gradient-to-r from-emerald-600 to-green-600 dark:from-emerald-500 dark:to-green-500 text-white font-black px-4 py-1 rounded-full uppercase tracking-widest text-[10px]">Aktif</Badge>
                            <p className="text-emerald-800 dark:text-emerald-200 font-medium leading-relaxed italic text-sm">
                                Dengan autentikasi dua faktor aktif, Anda akan diminta memasukan PIN acak yang aman saat login. PIN ini dapat diambil dari aplikasi TOTP di ponsel Anda.
                            </p>

                            <div className="w-full pt-4 border-t border-emerald-100 dark:border-emerald-900/30">
                                <TwoFactorRecoveryCodes
                                    recoveryCodesList={recoveryCodesList}
                                    fetchRecoveryCodes={fetchRecoveryCodes}
                                    errors={errors}
                                />
                            </div>

                            <div className="relative inline pt-4">
                                <Form {...disable.form()}>
                                    {({ processing }) => (
                                        <Button
                                            className="bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-700 hover:to-red-800 dark:from-rose-500 dark:to-red-600 text-white font-black h-12 px-8 rounded-xl text-xs uppercase tracking-widest shadow-lg shadow-rose-500/20"
                                            type="submit"
                                            disabled={processing}
                                        >
                                            <ShieldBan className="w-4 h-4 mr-2" /> Nonaktifkan 2FA
                                        </Button>
                                    )}
                                </Form>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-start justify-start space-y-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/20 p-8 rounded-2xl border border-amber-200 dark:border-amber-900/50 shadow-xl shadow-amber-500/5 transition-all">
                            <Badge className="bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-500 dark:to-orange-500 text-white font-black px-4 py-1 rounded-full uppercase tracking-widest text-[10px]">Nonaktif</Badge>
                            <p className="text-amber-800 dark:text-amber-200 font-medium leading-relaxed italic text-sm">
                                Ketika Anda mengaktifkan autentikasi dua faktor, Anda akan diminta PIN aman saat login. PIN ini dapat diperoleh dari aplikasi pendukung TOTP di ponsel Anda.
                            </p>

                            <div className="pt-4">
                                {hasSetupData ? (
                                    <Button
                                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-500 dark:to-blue-600 text-white font-black h-12 px-8 rounded-xl text-xs uppercase tracking-widest shadow-lg shadow-blue-500/20"
                                        onClick={() => setShowSetupModal(true)}
                                    >
                                        <ShieldCheck className="w-4 h-4 mr-2" />
                                        Lanjutkan Pengaturan
                                    </Button>
                                ) : (
                                    <Form
                                        {...enable.form()}
                                        onSuccess={() =>
                                            setShowSetupModal(true)
                                        }
                                    >
                                        {({ processing }) => (
                                            <Button
                                                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-500 dark:to-blue-600 text-white font-black h-12 px-8 rounded-xl text-xs uppercase tracking-widest shadow-lg shadow-blue-500/20"
                                                type="submit"
                                                disabled={processing}
                                            >
                                                <ShieldCheck className="w-4 h-4 mr-2" />
                                                Aktifkan 2FA
                                            </Button>
                                        )}
                                    </Form>
                                )}
                            </div>
                        </div>
                    )}

                    <TwoFactorSetupModal
                        isOpen={showSetupModal}
                        onClose={() => setShowSetupModal(false)}
                        requiresConfirmation={requiresConfirmation}
                        twoFactorEnabled={twoFactorEnabled}
                        qrCodeSvg={qrCodeSvg}
                        manualSetupKey={manualSetupKey}
                        clearSetupData={clearSetupData}
                        fetchSetupData={fetchSetupData}
                        errors={errors}
                    />
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}

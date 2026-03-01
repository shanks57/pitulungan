import PasswordController from '@/actions/App/Http/Controllers/Settings/PasswordController';
import InputError from '@/components/input-error';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { type BreadcrumbItem } from '@/types';
import { Transition } from '@headlessui/react';
import { Form, Head } from '@inertiajs/react';
import { useRef } from 'react';

import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { edit } from '@/routes/user-password';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Password settings',
        href: edit().url,
    },
];

export default function Password() {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Password settings" />

            <SettingsLayout>
                <div className="space-y-6 bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 dark:from-slate-950 dark:via-blue-950/30 dark:to-cyan-950 p-6 rounded-xl transition-colors duration-300">
                    <HeadingSmall
                        title="Update Password"
                        description="Pastikan akun Anda menggunakan kata sandi yang panjang dan acak untuk tetap aman"
                    />

                    <Form
                        {...PasswordController.update.form()}
                        options={{
                            preserveScroll: true,
                        }}
                        resetOnError={[
                            'password',
                            'password_confirmation',
                            'current_password',
                        ]}
                        resetOnSuccess
                        onError={(errors) => {
                            if (errors.password) {
                                passwordInput.current?.focus();
                            }

                            if (errors.current_password) {
                                currentPasswordInput.current?.focus();
                            }
                        }}
                        className="space-y-6 bg-gradient-to-br from-white to-blue-50 dark:from-slate-900 dark:to-slate-800 p-8 rounded-2xl shadow-xl dark:shadow-blue-900/10 border border-blue-100 dark:border-slate-800"
                    >
                        {({ errors, processing, recentlySuccessful }) => (
                            <>
                                <div className="grid gap-2">
                                    <Label htmlFor="current_password" className="text-blue-900 dark:text-blue-100 font-bold uppercase text-[10px] tracking-widest pl-1">
                                        Kata Sandi Saat Ini
                                    </Label>

                                    <Input
                                        id="current_password"
                                        ref={currentPasswordInput}
                                        name="current_password"
                                        type="password"
                                        className="h-12 border-blue-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-950 rounded-xl"
                                        autoComplete="current-password"
                                        placeholder="••••••••"
                                    />

                                    <InputError
                                        message={errors.current_password}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="password" className="text-blue-900 dark:text-blue-100 font-bold uppercase text-[10px] tracking-widest pl-1">
                                        Kata Sandi Baru
                                    </Label>

                                    <Input
                                        id="password"
                                        ref={passwordInput}
                                        name="password"
                                        type="password"
                                        className="h-12 border-blue-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-950 rounded-xl"
                                        autoComplete="new-password"
                                        placeholder="••••••••"
                                    />

                                    <InputError message={errors.password} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="password_confirmation" className="text-blue-900 dark:text-blue-100 font-bold uppercase text-[10px] tracking-widest pl-1">
                                        Konfirmasi Kata Sandi Baru
                                    </Label>

                                    <Input
                                        id="password_confirmation"
                                        name="password_confirmation"
                                        type="password"
                                        className="h-12 border-blue-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-950 rounded-xl"
                                        autoComplete="new-password"
                                        placeholder="••••••••"
                                    />

                                    <InputError
                                        message={errors.password_confirmation}
                                    />
                                </div>

                                <div className="flex items-center gap-4 pt-4">
                                    <Button
                                        disabled={processing}
                                        className="flex-1 sm:flex-none bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-500 dark:to-blue-600 shadow-lg shadow-blue-500/20 text-white font-black h-12 px-8 rounded-xl text-sm uppercase tracking-wider"
                                        data-test="update-password-button"
                                    >
                                        {processing ? 'Menyimpan...' : 'Simpan Kata Sandi'}
                                    </Button>

                                    <Transition
                                        show={recentlySuccessful}
                                        enter="transition ease-in-out"
                                        enterFrom="opacity-0"
                                        leave="transition ease-in-out"
                                        leaveTo="opacity-0"
                                    >
                                        <p className="text-sm text-emerald-600 dark:text-emerald-400 font-bold italic animate-pulse">
                                            Berhasil Disimpan!
                                        </p>
                                    </Transition>
                                </div>
                            </>
                        )}
                    </Form>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}

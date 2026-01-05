import { useState, useEffect } from 'react';

export function usePWAInstall() {
    const [isInstallable, setIsInstallable] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

    useEffect(() => {
        // Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsInstalled(true);
            return;
        }

        // Listen for install prompt
        const handleBeforeInstallPrompt = (e: any) => {
            console.log('[PWA] Install prompt available');
            e.preventDefault();
            setDeferredPrompt(e);
            setIsInstallable(true);
        };

        // Listen for successful installation
        const handleAppInstalled = () => {
            console.log('[PWA] App installed');
            setIsInstalled(true);
            setIsInstallable(false);
            setDeferredPrompt(null);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleAppInstalled);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, []);

    const install = async () => {
        if (!deferredPrompt) return;

        try {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;

            if (outcome === 'accepted') {
                console.log('[PWA] User accepted install');
                setIsInstallable(false);
                setDeferredPrompt(null);
            } else {
                console.log('[PWA] User dismissed install');
            }
        } catch (error) {
            console.error('[PWA] Install error:', error);
        }
    };

    return {
        isInstallable,
        isInstalled,
        install
    };
}
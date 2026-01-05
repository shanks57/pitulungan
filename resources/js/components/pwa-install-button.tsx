import { Button } from '@/components/ui/button';
import { Download, Smartphone } from 'lucide-react';
import { usePWAInstall } from '@/hooks/use-pwa-install';

interface PWAInstallButtonProps {
    variant?: 'default' | 'outline' | 'secondary';
    size?: 'default' | 'sm' | 'lg';
    className?: string;
}

export function PWAInstallButton({
    variant = 'default',
    size = 'default',
    className = ''
}: PWAInstallButtonProps) {
    const { isInstallable, isInstalled, install } = usePWAInstall();

    if (isInstalled) {
        return null; // Don't show if already installed
    }

    if (!isInstallable) {
        return null; // Don't show if not installable
    }

    console.log(isInstallable, "isInstallable", isInstalled, "isInstalled")

    return (
        <Button
            variant={variant}
            size={size}
            onClick={install}
            className={`flex items-center gap-2 ${className}`}
        >
            <Smartphone className="w-4 h-4" />
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Instal Aplikasi</span>
            <span className="sm:hidden">Instal</span>
        </Button>
    );
}
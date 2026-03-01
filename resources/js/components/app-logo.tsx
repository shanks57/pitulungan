import AppLogoIcon from './app-logo-icon';
import { cn } from '@/lib/utils';

export default function AppLogo({ className }: { className?: string }) {
    return (
        <>
            <AppLogoIcon className={cn("size-8", className)} />
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold text-gray-900 dark:text-white">
                    SIPERKASA
                </span>
            </div>
        </>
    );
}

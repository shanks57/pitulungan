import { Appearance, useAppearance } from '@/hooks/use-appearance';
import { cn } from '@/lib/utils';
import { LucideIcon, Monitor, Moon, Sun } from 'lucide-react';
import { HTMLAttributes } from 'react';

export default function AppearanceToggleTab({
    className = '',
    ...props
}: HTMLAttributes<HTMLDivElement>) {
    const { appearance, updateAppearance } = useAppearance();

    const tabs: { value: Appearance; icon: LucideIcon; label: string }[] = [
        { value: 'light', icon: Sun, label: 'Light' },
        { value: 'dark', icon: Moon, label: 'Dark' },
        { value: 'system', icon: Monitor, label: 'System' },
    ];

    return (
        <div
            className={cn(
                'inline-flex gap-2 rounded-xl bg-neutral-100 p-1.5 dark:bg-neutral-800 transition-all duration-300',
                className,
            )}
            {...props}
        >
            {tabs.map(({ value, icon: Icon, label }) => (
                <button
                    key={value}
                    onClick={() => updateAppearance(value)}
                    className={cn(
                        'flex items-center gap-2 rounded-lg px-4 py-2 transition-all duration-300 font-bold text-sm tracking-tight',
                        appearance === value
                            ? 'bg-white text-blue-600 shadow-md dark:bg-slate-700 dark:text-blue-300 ring-1 ring-blue-500/10'
                            : 'text-neutral-500 hover:bg-neutral-200/60 hover:text-black dark:text-neutral-400 dark:hover:bg-neutral-700/60 dark:hover:text-neutral-200',
                    )}
                >
                    <Icon className={cn("h-4 w-4", appearance === value ? "scale-110" : "")} />
                    <span>{label}</span>
                </button>
            ))}
        </div>
    );
}

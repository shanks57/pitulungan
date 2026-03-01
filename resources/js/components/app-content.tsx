import { SidebarInset } from '@/components/ui/sidebar';
import * as React from 'react';

interface AppContentProps extends React.ComponentProps<'main'> {
    variant?: 'header' | 'sidebar';
}

export function AppContent({
    variant = 'header',
    children,
    ...props
}: AppContentProps) {
    if (variant === 'sidebar') {
        return (
            <SidebarInset className="pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] md:pb-0" {...props}>
                {children}
            </SidebarInset>
        );
    }

    return (
        <main
            className="mx-auto flex h-full w-full max-w-7xl flex-1 flex-col gap-4 rounded-xl pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] md:pb-0"
            {...props}
        >
            {children}
        </main>
    );
}

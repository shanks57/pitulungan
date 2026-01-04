import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'User Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="User Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1>User Dashboard</h1>
                <p>Welcome, User. Here you can create tickets and track their progress.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Create Ticket</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>Report a new issue or maintenance request.</p>
                            <Link href="/tickets/create">
                                <Button className="mt-2">Create Ticket</Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>My Tickets</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>View and track your submitted tickets.</p>
                            <Button className="mt-2" variant="outline">
                                View Tickets
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
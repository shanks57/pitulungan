import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link, router } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Users', href: '/admin/users' },
];

interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    role: string;
    unit: string | null;
}

interface Props {
    users: {
        data: User[];
        links: any[];
    };
}

export default function Index({ users }: Props) {
    const handleDelete = (userId: number) => {
        if (confirm('Are you sure you want to delete this user?')) {
            router.delete(`/admin/users/${userId}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Users</h1>
                    <Link href="/admin/users/create">
                        <Button>Create User</Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {users.data.map((user) => (
                        <Card key={user.id}>
                            <CardHeader>
                                <CardTitle>{user.name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-600">@{user.username}</p>
                                <p className="text-sm text-gray-600">{user.email}</p>
                                <p className="text-sm">Role: {user.role}</p>
                                <p className="text-sm">Unit: {user.unit || '-'}</p>
                                <div className="mt-4 flex gap-2">
                                    <Link href={`/admin/users/${user.id}/edit`}>
                                        <Button variant="outline" size="sm">Edit</Button>
                                    </Link>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleDelete(user.id)}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Pagination can be added here */}
            </div>
        </AppLayout>
    );
}
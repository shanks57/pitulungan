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
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Users</h1>
                    <Link href="/admin/users/create">
                        <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg">Create User</Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {users.data.map((user) => (
                        <Card key={user.id} className="border-0 bg-gradient-to-br from-indigo-50 to-indigo-100 shadow-md hover:shadow-lg transition-all">
                            <CardHeader>
                                <CardTitle className="text-indigo-900">{user.name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-indigo-700">@{user.username}</p>
                                <p className="text-sm text-indigo-700">{user.email}</p>
                                <p className="text-sm text-indigo-800">Role: {user.role}</p>
                                <p className="text-sm text-indigo-800">Unit: {user.unit || '-'}</p>
                                <div className="mt-4 flex gap-2">
                                    <Link href={`/admin/users/${user.id}/edit`}>
                                        <Button variant="outline" size="sm" className="border-indigo-200 hover:bg-indigo-50">Edit</Button>
                                    </Link>
                                    <Button
                                        className="bg-red-600 hover:bg-red-700"
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
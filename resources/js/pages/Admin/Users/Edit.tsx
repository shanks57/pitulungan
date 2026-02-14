import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { router, useForm } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Users', href: '/admin/users' },
    { title: 'Edit', href: '/admin/users/edit' },
];

interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    role: string;
    unit: string | null;
}

interface Category {
    id: number;
    name: string;
}

interface Props {
    user: User;
    categories: Category[];
}

export default function Edit({ user, categories }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        unit: user.unit || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/users/${user.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pt-4 px-4 pb-20 md:p-4 rounded-xl">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">Edit User</h1>

                <form onSubmit={handleSubmit} className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-xl shadow-lg max-w-2xl space-y-4">
                    <div>
                        <Label htmlFor="name" className="text-blue-900 font-semibold">Name</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                        />
                        {errors.name && <p className="text-red-500 text-sm font-semibold">{errors.name}</p>}
                    </div>

                    <div>
                        <Label htmlFor="username" className="text-blue-900 font-semibold">Username</Label>
                        <Input
                            id="username"
                            value={data.username}
                            onChange={(e) => setData('username', e.target.value)}
                            required
                            className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                        />
                        {errors.username && <p className="text-red-500 text-sm font-semibold">{errors.username}</p>}
                    </div>

                    <div>
                        <Label htmlFor="email" className="text-blue-900 font-semibold">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                            className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                        />
                        {errors.email && <p className="text-red-500 text-sm font-semibold">{errors.email}</p>}
                    </div>

                    <div>
                        <Label htmlFor="role" className="text-blue-900 font-semibold">Role</Label>
                        <Select value={data.role} onValueChange={(value) => setData('role', value)}>
                            <SelectTrigger className="border-blue-200 focus:border-blue-500 focus:ring-blue-500">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="technician">Teknisi</SelectItem>
                                <SelectItem value="user">User</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.role && <p className="text-red-500 text-sm font-semibold">{errors.role}</p>}
                    </div>

                    {data.role === 'technician' && (
                        <div>
                            <Label htmlFor="unit" className="text-blue-900 font-semibold">Unit</Label>
                            <Select value={data.unit} onValueChange={(value) => setData('unit', value)}>
                                <SelectTrigger className="border-blue-200 focus:border-blue-500 focus:ring-blue-500">
                                    <SelectValue placeholder="Pilih Unit" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((category) => (
                                        <SelectItem key={category.id} value={category.name}>
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.unit && <p className="text-red-500 text-sm font-semibold">{errors.unit}</p>}
                        </div>
                    )}

                    <Button type="submit" disabled={processing} className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold">
                        Update User
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}
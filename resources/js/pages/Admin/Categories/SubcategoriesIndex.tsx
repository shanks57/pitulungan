import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link, router } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Subcategories', href: '/admin/subcategories' },
];

interface Category {
    id: number;
    name: string;
}

interface Subcategory {
    id: number;
    name: string;
    description?: string;
    category: Category;
}

interface Props {
    subcategories: {
        data: Subcategory[];
        links: any[];
    };
    categories: Category[];
}

export default function SubcategoriesIndex({ subcategories }: Props) {
    const handleDelete = (subcategoryId: number) => {
        if (confirm('Are you sure you want to delete this subcategory?')) {
            router.delete(`/admin/subcategories/${subcategoryId}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Ticket Subcategories</h1>
                    <Link href="/admin/subcategories/create">
                        <Button>Create Subcategory</Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {subcategories.data.map((subcategory) => (
                        <Card key={subcategory.id}>
                            <CardHeader>
                                <CardTitle>{subcategory.name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-600 mb-2">Category: <span className="font-semibold">{subcategory.category.name}</span></p>
                                <p className="text-sm text-gray-600 mb-4">{subcategory.description || 'No description'}</p>
                                <div className="mt-4 flex gap-2">
                                    <Link href={`/admin/subcategories/${subcategory.id}/edit`}>
                                        <Button variant="outline" size="sm">Edit</Button>
                                    </Link>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleDelete(subcategory.id)}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {subcategories.data.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        No subcategories found. <Link href="/admin/subcategories/create" className="text-blue-600 hover:underline">Create one</Link>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

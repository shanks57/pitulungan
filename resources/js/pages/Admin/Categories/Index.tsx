import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link, router } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Categories', href: '/admin/categories' },
];

interface Subcategory {
    id: number;
    name: string;
    description?: string;
}

interface Category {
    id: number;
    name: string;
    description?: string;
    subcategories: Subcategory[];
}

interface Props {
    categories: {
        data: Category[];
        links: any[];
    };
}

export default function Index({ categories }: Props) {
    const handleDelete = (categoryId: number) => {
        if (confirm('Are you sure you want to delete this category? Associated subcategories will also be deleted.')) {
            router.delete(`/admin/categories/${categoryId}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Ticket Categories</h1>
                    <Link href="/admin/categories/create">
                        <Button>Create Category</Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories.data.map((category) => (
                        <Card key={category.id}>
                            <CardHeader>
                                <CardTitle>{category.name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-600 mb-4">{category.description || 'No description'}</p>
                                
                                {category.subcategories && category.subcategories.length > 0 && (
                                    <div className="mb-4">
                                        <h4 className="text-sm font-semibold mb-2">Subcategories ({category.subcategories.length})</h4>
                                        <ul className="text-sm space-y-1">
                                            {category.subcategories.slice(0, 3).map((sub) => (
                                                <li key={sub.id} className="text-gray-600">• {sub.name}</li>
                                            ))}
                                            {category.subcategories.length > 3 && (
                                                <li className="text-gray-600">• +{category.subcategories.length - 3} more</li>
                                            )}
                                        </ul>
                                    </div>
                                )}

                                <div className="mt-4 flex gap-2 flex-wrap">
                                    <Link href={`/admin/categories/${category.id}/technicians`}>
                                        <Button variant="outline" size="sm">Assign Technicians</Button>
                                    </Link>
                                    <Link href={`/admin/categories/${category.id}/edit`}>
                                        <Button variant="outline" size="sm">Edit</Button>
                                    </Link>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleDelete(category.id)}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {categories.data.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        No categories found. <Link href="/admin/categories/create" className="text-blue-600 hover:underline">Create one</Link>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

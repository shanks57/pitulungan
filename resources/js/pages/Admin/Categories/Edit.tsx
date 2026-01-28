import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link, router, useForm } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';

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
    category: Category;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Categories', href: '/admin/categories' },
    { title: 'Edit', href: '' },
];

export default function Edit({ category }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: category.name,
        description: category.description || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/categories/${category.id}`);
    };

    const handleDeleteSubcategory = (subcategoryId: number) => {
        if (confirm('Are you sure you want to delete this subcategory?')) {
            router.delete(`/admin/subcategories/${subcategoryId}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1 className="text-2xl font-bold">Edit Category</h1>

                <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
                    <div>
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>

                    <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                        />
                        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                    </div>

                    <div className="flex gap-2">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Updating...' : 'Update Category'}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => window.history.back()}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>

                {/* Subcategories Section */}
                {category.subcategories && category.subcategories.length > 0 && (
                    <div className="mt-8">
                        <h2 className="text-xl font-bold mb-4">Subcategories</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {category.subcategories.map((subcategory) => (
                                <Card key={subcategory.id}>
                                    <CardHeader>
                                        <CardTitle className="text-lg">{subcategory.name}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-gray-600 mb-4">{subcategory.description || 'No description'}</p>
                                        <div className="flex gap-2">
                                            <Link href={`/admin/subcategories/${subcategory.id}/edit`}>
                                                <Button variant="outline" size="sm">Edit</Button>
                                            </Link>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleDeleteSubcategory(subcategory.id)}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                <Link href="/admin/subcategories/create" className="mt-4">
                    <Button>Add Subcategory</Button>
                </Link>
            </div>
        </AppLayout>
    );
}

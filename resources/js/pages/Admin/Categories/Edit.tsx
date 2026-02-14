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
            <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pt-4 px-4 pb-20 md:p-4 rounded-xl">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">Edit Category</h1>

                <form onSubmit={handleSubmit} className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-xl shadow-lg max-w-2xl space-y-4 mb-8">
                    <div>
                        <Label htmlFor="name" className="text-blue-900 font-semibold">Name</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1 font-semibold">{errors.name}</p>}
                    </div>

                    <div>
                        <Label htmlFor="description" className="text-blue-900 font-semibold">Description</Label>
                        <Textarea
                            id="description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                        />
                        {errors.description && <p className="text-red-500 text-sm mt-1 font-semibold">{errors.description}</p>}
                    </div>

                    <div className="flex gap-2 pt-4">
                        <Button type="submit" disabled={processing} className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold">
                            {processing ? 'Updating...' : 'Update Category'}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            className="border-blue-200 text-blue-600 hover:bg-blue-50"
                            onClick={() => window.history.back()}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>

                {/* Subcategories Section */}
                {category.subcategories && category.subcategories.length > 0 && (
                    <div className="mt-8">
                        <h2 className="text-2xl font-bold text-blue-900 mb-4">Subcategories</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {category.subcategories.map((subcategory) => (
                                <Card key={subcategory.id} className="border-0 bg-gradient-to-br from-emerald-50 to-emerald-100 shadow-md">
                                    <CardHeader>
                                        <CardTitle className="text-lg text-emerald-900">{subcategory.name}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-emerald-700 mb-4">{subcategory.description || 'No description'}</p>
                                        <div className="flex gap-2">
                                            <Link href={`/admin/subcategories/${subcategory.id}/edit`}>
                                                <Button variant="outline" size="sm" className="border-emerald-200 text-emerald-600 hover:bg-emerald-50">Edit</Button>
                                            </Link>
                                            <Button
                                                className="bg-red-600 hover:bg-red-700 text-white font-semibold"
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

                <Link href="/admin/subcategories/create" className="mt-4 block">
                    <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold">Add Subcategory</Button>
                </Link>
            </div>
        </AppLayout>
    );
}

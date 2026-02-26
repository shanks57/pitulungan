import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Link, router, useForm } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import Pagination from '@/components/Pagination';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dasbor', href: '/dashboard' },
    { title: 'Subkategori', href: '/admin/subcategories' },
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
    filters: {
        search: string;
    };
}

export default function SubcategoriesIndex({ subcategories, filters }: Props) {
    const { data, setData, get, processing } = useForm({
        search: filters.search || '',
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        get('/admin/subcategories', {
            preserveState: true,
        });
    };

    const handleDelete = (subcategoryId: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus subkategori ini?')) {
            router.delete(`/admin/subcategories/${subcategoryId}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Subkategori Tiket</h1>
                    <div className="flex flex-col md:flex-row gap-4">
                        <form onSubmit={handleSearch} className="flex gap-2">
                            <Input
                                placeholder="Cari berdasarkan nama..."
                                value={data.search}
                                onChange={(e) => setData('search', e.target.value)}
                                className="w-full md:w-64 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                            />
                            <Button type="submit" disabled={processing} variant="secondary">Cari</Button>
                        </form>
                        <Link href="/admin/subcategories/create">
                            <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-lg">Buat Subkategori</Button>
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {subcategories.data.map((subcategory) => (
                        <Card key={subcategory.id}>
                            <CardHeader>
                                <CardTitle className="text-blue-900">{subcategory.name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-blue-700 mb-2">Kategori: <span className="font-semibold text-blue-900">{subcategory.category.name}</span></p>
                                <p className="text-sm text-blue-600 mb-4">{subcategory.description || 'Tidak ada deskripsi'}</p>
                                <div className="mt-4 flex gap-2">
                                    <Link href={`/admin/subcategories/${subcategory.id}/edit`}>
                                        <Button variant="outline" size="sm" className="border-blue-200 text-blue-600 hover:bg-blue-50">Edit</Button>
                                    </Link>
                                    <Button
                                        className="bg-red-600 hover:bg-red-700"
                                        size="sm"
                                        onClick={() => handleDelete(subcategory.id)}
                                    >
                                        Hapus
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {subcategories.data.length === 0 && (
                    <div className="text-center py-8 text-blue-500">
                        Tidak ada subkategori ditemukan. <Link href="/admin/subcategories/create" className="text-blue-600 font-semibold hover:underline">Buat baru</Link>
                    </div>
                )}

                {/* Pagination */}
                <Pagination links={subcategories.links} />
            </div>
        </AppLayout>
    );
}

import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link, router } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dasbor', href: '/dashboard' },
    { title: 'Kategori', href: '/admin/categories' },
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
        if (confirm('Apakah Anda yakin ingin menghapus kategori ini? Subkategori terkait juga akan dihapus.')) {
            router.delete(`/admin/categories/${categoryId}`, {
                onSuccess: () => {
                    toast.success('Kategori berhasil dihapus!');
                },
                onError: () => {
                    toast.error('Gagal menghapus kategori.');
                }
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pt-4 px-4 pb-20 md:p-4 rounded-xl">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Kategori Tiket</h1>
                    <Link href="/admin/categories/create">
                        <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold">Buat Kategori</Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories.data.map((category) => (
                        <Card key={category.id} className="border-0 bg-gradient-to-br from-indigo-50 to-indigo-100 shadow-md">
                            <CardHeader>
                                <CardTitle className="text-indigo-900">{category.name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-indigo-700 mb-4">{category.description || 'Tidak ada deskripsi'}</p>

                                {category.subcategories && category.subcategories.length > 0 && (
                                    <div className="mb-4">
                                        <h4 className="text-sm font-semibold text-indigo-900 mb-2">Subkategori ({category.subcategories.length})</h4>
                                        <ul className="text-sm space-y-1">
                                            {category.subcategories.slice(0, 3).map((sub) => (
                                                <li key={sub.id} className="text-indigo-700">• {sub.name}</li>
                                            ))}
                                            {category.subcategories.length > 3 && (
                                                <li className="text-indigo-700">• +{category.subcategories.length - 3} lainnya</li>
                                            )}
                                        </ul>
                                    </div>
                                )}

                                <div className="mt-4 flex gap-2 flex-wrap">
                                    <Link href={`/admin/categories/${category.id}/technicians`}>
                                        <Button variant="outline" size="sm" className="border-indigo-200 text-indigo-600 hover:bg-indigo-50">Tugaskan Teknisi</Button>
                                    </Link>
                                    <Link href={`/admin/categories/${category.id}/edit`}>
                                        <Button variant="outline" size="sm" className="border-indigo-200 text-indigo-600 hover:bg-indigo-50">Edit</Button>
                                    </Link>
                                    <Button
                                        className="bg-red-600 hover:bg-red-700 text-white font-semibold"
                                        size="sm"
                                        onClick={() => handleDelete(category.id)}
                                    >
                                        Hapus
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {categories.data.length === 0 && (
                    <div className="text-center py-8 text-indigo-600">
                        Tidak ada kategori ditemukan. <Link href="/admin/categories/create" className="font-semibold hover:text-indigo-700">Buat baru</Link>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

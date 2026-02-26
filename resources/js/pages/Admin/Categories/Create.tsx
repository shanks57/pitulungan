import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { router, useForm } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dasbor', href: '/dashboard' },
    { title: 'Kategori', href: '/admin/categories' },
    { title: 'Buat', href: '/admin/categories/create' },
];

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/categories', {
            onSuccess: () => {
                toast.success('Kategori berhasil dibuat!');
            },
            onError: () => {
                toast.error('Gagal membuat kategori.');
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pt-4 px-4 pb-20 md:p-4 rounded-xl">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">Buat Kategori</h1>

                <form onSubmit={handleSubmit} className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-xl shadow-lg max-w-2xl space-y-4">
                    <div>
                        <Label htmlFor="name" className="text-blue-900 font-semibold">Nama</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Contoh: Dukungan Teknis"
                            required
                            className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1 font-semibold">{errors.name}</p>}
                    </div>

                    <div>
                        <Label htmlFor="description" className="text-blue-900 font-semibold">Deskripsi</Label>
                        <Textarea
                            id="description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            placeholder="Jelaskan kategori ini"
                            className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                        />
                        {errors.description && <p className="text-red-500 text-sm mt-1 font-semibold">{errors.description}</p>}
                    </div>

                    <div className="flex gap-2 pt-4">
                        <Button type="submit" disabled={processing} className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold">
                            {processing ? 'Menyimpan...' : 'Buat Kategori'}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            className="border-blue-200 text-blue-600 hover:bg-blue-50"
                            onClick={() => window.history.back()}
                        >
                            Batal
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}

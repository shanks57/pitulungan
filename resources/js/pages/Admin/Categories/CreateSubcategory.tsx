import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';

interface Category {
    id: number;
    name: string;
}

interface Props {
    categories: Category[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dasbor', href: '/dashboard' },
    { title: 'Subkategori', href: '/admin/subcategories' },
    { title: 'Buat', href: '/admin/subcategories/create' },
];

export default function CreateSubcategory({ categories }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        category_id: '',
        name: '',
        description: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/subcategories');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pt-4 px-4 pb-20 md:p-4 rounded-xl">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">Buat Subkategori</h1>

                <form onSubmit={handleSubmit} className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-xl shadow-lg max-w-2xl space-y-4">
                    <div>
                        <Label htmlFor="category_id" className="text-blue-900 font-semibold">Kategori</Label>
                        <Select value={data.category_id} onValueChange={(value) => setData('category_id', value)}>
                            <SelectTrigger className="border-blue-200 focus:border-blue-500 focus:ring-blue-500">
                                <SelectValue placeholder="Pilih kategori" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((category) => (
                                    <SelectItem key={category.id} value={category.id.toString()}>
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.category_id && <p className="text-red-500 text-sm mt-1 font-semibold">{errors.category_id}</p>}
                    </div>

                    <div>
                        <Label htmlFor="name" className="text-blue-900 font-semibold">Nama</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Contoh: Masalah Perangkat Keras"
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
                            placeholder="Jelaskan subkategori ini"
                            className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                        />
                        {errors.description && <p className="text-red-500 text-sm mt-1 font-semibold">{errors.description}</p>}
                    </div>

                    <div className="flex gap-2 pt-4">
                        <Button type="submit" disabled={processing} className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold">
                            {processing ? 'Menyimpan...' : 'Buat Subkategori'}
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

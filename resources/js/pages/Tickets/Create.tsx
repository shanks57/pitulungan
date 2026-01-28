import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { router, useForm } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dasbor', href: '/dashboard' },
    { title: 'Buat Tiket', href: '/tickets/create' },
];

interface Category {
    id: number;
    name: string;
    description: string;
    subcategories?: Subcategory[];
}

interface Subcategory {
    id: number;
    name: string;
    description: string;
}

interface Sla {
    id: number;
    priority: string;
    response_time_minutes: number;
    resolution_time_minutes: number;
}

interface Props {
    categories: Category[];
    slas: Sla[];
}

export default function Create({ categories, slas }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        category_id: '',
        subcategory_id: '',
        title: '',
        description: '',
        location: '',
        priority: 'medium',
        attachments: [] as File[],
    });

    const selectedCategory = categories.find(c => c.id === parseInt(data.category_id));
    const subcategories = selectedCategory?.subcategories || [];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post('/tickets', {
            forceFormData: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1 className="text-2xl font-bold">Buat Tiket Baru</h1>

                <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
                    <div>
                        <Label htmlFor="category_id">Kategori</Label>
                        <Select value={data.category_id} onValueChange={(value) => {
                            setData('category_id', value);
                            setData('subcategory_id', ''); // Reset subcategory when category changes
                        }}>
                            <SelectTrigger>
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
                        {errors.category_id && <p className="text-red-500">{errors.category_id}</p>}
                    </div>

                    <div>
                        <Label htmlFor="subcategory_id">Subkategori (opsional)</Label>
                        {subcategories.length > 0 ? (
                            <>
                                <Select value={data.subcategory_id} onValueChange={(value) => setData('subcategory_id', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih subkategori" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">Tidak ada subkategori</SelectItem>
                                        {subcategories.map((subcategory) => (
                                            <SelectItem key={subcategory.id} value={subcategory.id.toString()}>
                                                {subcategory.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.subcategory_id && <p className="text-red-500 text-sm mt-1">{errors.subcategory_id}</p>}
                            </>
                        ) : (
                            <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500">
                                Tidak ada subkategori untuk kategori ini
                            </div>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="title">Judul</Label>
                        <Input
                            id="title"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            required
                            placeholder="Deskripsi singkat masalah"
                        />
                        {errors.title && <p className="text-red-500">{errors.title}</p>}
                    </div>

                    <div>
                        <Label htmlFor="description">Deskripsi</Label>
                        <textarea
                            id="description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            required
                            placeholder="Deskripsi detail masalah"
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        {errors.description && <p className="text-red-500">{errors.description}</p>}
                    </div>

                    <div>
                        <Label htmlFor="attachments">Lampiran (opsional)</Label>
                        <Input
                            id="attachments"
                            type="file"
                            multiple
                            onChange={(e) => {
                                const files = Array.from(e.target.files || []);
                                setData('attachments', files);
                            }}
                            accept="image/*,.pdf,.doc,.docx,.txt"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                            Anda dapat mengupload beberapa file (gambar, PDF, dokumen)
                        </p>
                        {errors.attachments && <p className="text-red-500">{errors.attachments}</p>}
                    </div>

                    <div>
                        <Label htmlFor="location">Lokasi</Label>
                        <Input
                            id="location"
                            value={data.location}
                            onChange={(e) => setData('location', e.target.value)}
                            required
                            placeholder="Di mana lokasi masalah?"
                        />
                        {errors.location && <p className="text-red-500">{errors.location}</p>}
                    </div>

                    <div>
                        <Label htmlFor="priority">Prioritas</Label>
                        <Select value={data.priority} onValueChange={(value) => setData('priority', value)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="low">Rendah</SelectItem>
                                <SelectItem value="medium">Sedang</SelectItem>
                                <SelectItem value="high">Tinggi</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.priority && <p className="text-red-500">{errors.priority}</p>}
                    </div>

                    <Button type="submit" disabled={processing}>
                        Buat Tiket
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}
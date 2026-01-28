import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';

interface Technician {
    id: number;
    name: string;
    username: string;
    email: string;
}

interface Category {
    id: number;
    name: string;
    description?: string;
}

interface Props {
    category: Category;
    technicians: Technician[];
    assignedTechnicians: number[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Categories', href: '/admin/categories' },
    { title: 'Manage Technicians', href: '' },
];

export default function ManageTechnicians({ category, technicians, assignedTechnicians }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        technician_ids: assignedTechnicians,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/admin/categories/${category.id}/assign-technicians`);
    };

    const handleTechnicianToggle = (technicianId: number) => {
        const updated = Array.isArray(data.technician_ids) ? [...data.technician_ids] : [];
        const index = updated.indexOf(technicianId);
        
        if (index > -1) {
            updated.splice(index, 1);
        } else {
            updated.push(technicianId);
        }
        
        setData('technician_ids', updated);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1 className="text-2xl font-bold">Assign Technicians to {category.name}</h1>
                <p className="text-gray-600">{category.description || 'No description'}</p>

                <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
                    <div className="border rounded-lg p-4">
                        <h2 className="text-lg font-semibold mb-4">Select Technicians</h2>
                        <p className="text-sm text-gray-600 mb-4">
                            Choose which technicians should handle tickets in this category. They will be automatically assigned tickets when created.
                        </p>

                        <div className="space-y-3">
                            {technicians.length > 0 ? (
                                technicians.map((technician) => (
                                    <div key={technician.id} className="flex items-center space-x-3 p-3 border rounded hover:bg-gray-50">
                                        <Checkbox
                                            id={`tech-${technician.id}`}
                                            checked={Array.isArray(data.technician_ids) && data.technician_ids.includes(technician.id)}
                                            onCheckedChange={() => handleTechnicianToggle(technician.id)}
                                        />
                                        <Label htmlFor={`tech-${technician.id}`} className="cursor-pointer flex-1">
                                            <div>
                                                <p className="font-semibold">{technician.name}</p>
                                                <p className="text-sm text-gray-600">@{technician.username} - {technician.email}</p>
                                            </div>
                                        </Label>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500">No technicians available</p>
                            )}
                        </div>
                    </div>

                    {errors.technician_ids && <p className="text-red-500">{errors.technician_ids}</p>}

                    <div className="flex gap-2">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving...' : 'Save Assignments'}
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
            </div>
        </AppLayout>
    );
}

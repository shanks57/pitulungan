import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { router, useForm, Link } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dasbor', href: '/dashboard' },
    { title: 'Tiket', href: '/admin/tickets' },
];

interface Ticket {
    id: number;
    ticket_number: string;
    title: string;
    description: string;
    status: string;
    priority: string;
    location: string;
    user: { name: string };
    category: { name: string };
    assigned_user: { name: string } | null;
}

interface User {
    id: number;
    name: string;
}

interface Props {
    tickets: {
        data: Ticket[];
        links: any[];
    };
    filters: {
        search: string;
        status: string;
        priority: string;
        assigned_to: string;
        date_from: string;
    };
    users: User[];
    counts: {
        open: number;
        in_progress: number;
        resolved_today: number;
        total: number;
    };
}

export default function Index({ tickets, filters, users, counts }: Props) {
    const { data, setData, get, processing } = useForm({
        search: filters.search || '',
        status: filters.status || '',
        priority: filters.priority || '',
        assigned_to: filters.assigned_to || '',
        date_from: filters.date_from || '',
    });

    const handleFilter = () => {
        get('/admin/tickets', {
            preserveState: true,
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'submitted': return 'bg-yellow-500';
            case 'processed': return 'bg-blue-500';
            case 'repairing': return 'bg-orange-500';
            case 'done': return 'bg-green-500';
            case 'rejected': return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'low': return 'bg-green-500';
            case 'medium': return 'bg-yellow-500';
            case 'high': return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pt-4 px-4 pb-20 md:p-4 rounded-xl">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">Tiket Pemeliharaan</h1>

                {/* Counts */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <Card className="border-0 bg-gradient-to-br from-blue-50 to-blue-100 shadow-md">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-semibold text-blue-900">Tiket Terbuka</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-blue-700">{counts.open}</div>
                        </CardContent>
                    </Card>
                    <Card className="border-0 bg-gradient-to-br from-amber-50 to-amber-100 shadow-md">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-semibold text-amber-900">Sedang Dikerjakan</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-amber-700">{counts.in_progress}</div>
                        </CardContent>
                    </Card>
                    <Card className="border-0 bg-gradient-to-br from-green-50 to-emerald-100 shadow-md">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-semibold text-green-900">Diselesaikan Hari Ini</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-green-700">{counts.resolved_today}</div>
                        </CardContent>
                    </Card>
                    <Card className="border-0 bg-gradient-to-br from-purple-50 to-indigo-100 shadow-md">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-semibold text-purple-900">Total Tiket</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-purple-700">{counts.total}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <div className="bg-gradient-to-r from-white to-blue-50 p-4 rounded-xl mb-6 flex gap-4 flex-wrap border border-blue-200">
                    <Input
                        placeholder="Cari tiket..."
                        value={data.search}
                        onChange={(e) => setData('search', e.target.value)}
                        className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                    <Select value={data.status} onValueChange={(value) => setData('status', value)}>
                        <SelectTrigger className="w-40 border-blue-200 focus:border-blue-500 focus:ring-blue-500">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Status</SelectItem>
                            <SelectItem value="submitted">Diajukan</SelectItem>
                            <SelectItem value="processed">Diproses</SelectItem>
                            <SelectItem value="repairing">Diperbaiki</SelectItem>
                            <SelectItem value="done">Selesai</SelectItem>
                            <SelectItem value="rejected">Ditolak</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={data.priority} onValueChange={(value) => setData('priority', value)}>
                        <SelectTrigger className="w-40 border-blue-200 focus:border-blue-500 focus:ring-blue-500">
                            <SelectValue placeholder="Prioritas" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Prioritas</SelectItem>
                            <SelectItem value="low">Rendah</SelectItem>
                            <SelectItem value="medium">Sedang</SelectItem>
                            <SelectItem value="high">Tinggi</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={data.assigned_to} onValueChange={(value) => setData('assigned_to', value)}>
                        <SelectTrigger className="w-40 border-blue-200 focus:border-blue-500 focus:ring-blue-500">
                            <SelectValue placeholder="Ditugaskan Ke" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Pengguna</SelectItem>
                            <SelectItem value="me">Ditugaskan kepada Saya</SelectItem>
                            {users.map((user) => (
                                <SelectItem key={user.id} value={user.id.toString()}>
                                    {user.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select value={data.date_from} onValueChange={(value) => setData('date_from', value)}>
                        <SelectTrigger className="w-40 border-blue-200 focus:border-blue-500 focus:ring-blue-500">
                            <SelectValue placeholder="Periode" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Waktu</SelectItem>
                            <SelectItem value="today">Hari Ini</SelectItem>
                            <SelectItem value="7days">7 Hari Terakhir</SelectItem>
                            <SelectItem value="14days">14 Hari Terakhir</SelectItem>
                            <SelectItem value="30days">30 Hari Terakhir</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button onClick={handleFilter} disabled={processing} className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold">
                        Filter
                    </Button>
                </div>

                {/* Create New Ticket Button */}
                <div className="flex justify-end mb-6">
                    <Link href="/tickets/create">
                        <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold">Buat Tiket Baru</Button>
                    </Link>
                </div>

                {/* Tickets */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {tickets.data.map((ticket) => (
                        <Link key={ticket.id} href={`/admin/tickets/${ticket.id}`} className="block">
                            <Card className="border-0 bg-gradient-to-br from-white to-blue-50 shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="text-lg text-blue-900">{ticket.title}</CardTitle>
                                        <Badge className={getStatusColor(ticket.status)}>
                                            {ticket.status}
                                        </Badge>
                                    </div>
                                    <div className="text-sm text-blue-600">
                                        #{ticket.ticket_number} • {ticket.category.name}
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm mb-2 text-blue-700">
                                        {ticket.description.length > 100
                                            ? ticket.description.substring(0, 100) + '...'
                                            : ticket.description}
                                    </p>
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="text-sm">
                                            <Badge variant="outline" className={getPriorityColor(ticket.priority)}>
                                                {ticket.priority}
                                            </Badge>
                                        </div>
                                        <div className="text-xs text-blue-600">
                                            {ticket.user.name}
                                        </div>
                                    </div>
                                    {ticket.assigned_user && (
                                        <div className="text-xs text-blue-600">
                                            Ditugaskan ke: {ticket.assigned_user.name}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>

                {/* Pagination can be added here */}
            </div>
        </AppLayout>
    );
}
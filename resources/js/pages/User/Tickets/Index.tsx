import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { router, Link } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { CheckCircle, Clock, Wrench, AlertTriangle, Plus, Eye, XCircle, FileText } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dasbor', href: '/dashboard' },
    { title: 'Tiket Saya', href: '/user/tickets' },
];

interface Ticket {
    id: number;
    ticket_number: string;
    title: string;
    description: string;
    status: string;
    priority: string;
    location: string;
    category: { name: string };
    assigned_user: { name: string } | null;
    created_at: string;
    updated_at: string;
    progress?: Array<{
        status: string;
        note?: string;
        created_at: string;
    }>;
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
    };
    stats: {
        total: number;
        open: number;
        in_progress: number;
        resolved: number;
    };
}

export default function Index({ tickets, filters, stats }: Props) {
    const handleFilter = () => {
        router.get('/user/tickets', {
            search: filters.search,
            status: filters.status,
            priority: filters.priority,
        }, {
            preserveState: true,
            replace: true,
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

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'submitted': return <Clock className="h-4 w-4" />;
            case 'processed': return <Clock className="h-4 w-4" />;
            case 'repairing': return <Wrench className="h-4 w-4" />;
            case 'done': return <CheckCircle className="h-4 w-4" />;
            case 'rejected': return <XCircle className="h-4 w-4" />;
            default: return <FileText className="h-4 w-4" />;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tiket Saya" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl px-4 pt-4 pb-20 md:p-4 bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Tiket Saya</h1>
                    <Link href="/tickets/create">
                        <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg">
                            <Plus className="mr-2 h-4 w-4" />
                            Buat Tiket Baru
                        </Button>
                    </Link>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                    <Card className="border-0 bg-gradient-to-br from-blue-50 to-blue-100 shadow-md">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-blue-900">Total Tiket</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-700">{stats.total}</div>
                            <p className="text-xs text-blue-600">Semua tiket saya</p>
                        </CardContent>
                    </Card>

                    <Card className="border-0 bg-gradient-to-br from-amber-50 to-amber-100 shadow-md">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-amber-900">Terbuka</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-amber-700">{stats.open}</div>
                            <p className="text-xs text-amber-600">Menunggu respons</p>
                        </CardContent>
                    </Card>

                    <Card className="border-0 bg-gradient-to-br from-purple-50 to-purple-100 shadow-md">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-purple-900">Sedang Dikerjakan</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-purple-700">{stats.in_progress}</div>
                            <p className="text-xs text-purple-600">Sedang dikerjakan</p>
                        </CardContent>
                    </Card>

                    <Card className="border-0 bg-gradient-to-br from-green-50 to-green-100 shadow-md">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-green-900">Diselesaikan</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-700">{stats.resolved}</div>
                            <p className="text-xs text-green-600">Tiket selesai</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 bg-gradient-to-r from-white to-blue-50 p-4 rounded-xl border-0 shadow-sm">
                    <Input
                        placeholder="Cari tiket..."
                        value={filters.search}
                        onChange={(e) => router.get('/user/tickets', {
                            ...filters,
                            search: e.target.value
                        }, { preserveState: true, replace: true })}
                    />
                    <Select
                        value={filters.status}
                        onValueChange={(value) => router.get('/user/tickets', {
                            ...filters,
                            status: value
                        }, { preserveState: true, replace: true })}
                    >
                        <SelectTrigger className="w-40">
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
                    <Select
                        value={filters.priority}
                        onValueChange={(value) => router.get('/user/tickets', {
                            ...filters,
                            priority: value
                        }, { preserveState: true, replace: true })}
                    >
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Prioritas" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Prioritas</SelectItem>
                            <SelectItem value="low">Rendah</SelectItem>
                            <SelectItem value="medium">Sedang</SelectItem>
                            <SelectItem value="high">Tinggi</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Tickets List */}
                <div className="space-y-4">
                    {tickets.data.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
                                <h3 className="text-lg font-semibold mb-2">Tidak ada tiket ditemukan</h3>
                                <p className="text-muted-foreground text-center mb-4">
                                    Anda belum membuat tiket apapun, atau tidak ada tiket yang cocok dengan filter Anda.
                                </p>
                                <Link href="/tickets/create">
                                    <Button>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Buat Tiket Pertama Anda
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ) : (
                        tickets.data.map((ticket) => (
                            <div key={ticket.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border-0 rounded-lg bg-white/60 hover:bg-white transition-colors gap-3 shadow-sm">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-2 mb-3">
                                            <span className="font-medium text-blue-900 mr-2">{ticket.ticket_number}</span>
                                            <div className="flex flex-wrap items-center gap-2">
                                                <Badge className={`${getStatusColor(ticket.status)} whitespace-nowrap`}>
                                                    {getStatusIcon(ticket.status)}
                                                    <span className="ml-1">{ticket.status}</span>
                                                </Badge>
                                                <Badge className={`${getPriorityColor(ticket.priority)} whitespace-nowrap`}>
                                                    {ticket.priority}
                                                </Badge>
                                            </div>
                                        </div>
                                        <p className="text-sm text-slate-700 mb-1 break-words font-medium">{ticket.title}</p>
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 text-xs text-slate-600">
                                            <span className="truncate">Kategori: {ticket.category.name}</span>
                                       
                                            {ticket.progress && ticket.progress.length > 0 && (
                                                <span className="truncate">Pembaruan terakhir: {new Date(ticket.progress[0].created_at).toLocaleDateString()}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex-shrink-0 w-full md:w-auto mt-3 md:mt-0 md:ml-4">
                                        <Link href={`/user/tickets/${ticket.id}`}>
                                            <Button variant="outline" size="sm" className="w-full md:w-auto justify-center border-blue-300 hover:bg-blue-50">
                                                <Eye className="h-4 w-4" />
                                                <span className="sr-only sm:not-sr-only ml-2">Lihat</span>
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                        ))
                    )}
                </div>

                {/* Pagination would go here if needed */}
                {tickets.links && tickets.links.length > 3 && (
                    <div className="flex justify-center mt-6">
                        {/* Pagination component would be implemented here */}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
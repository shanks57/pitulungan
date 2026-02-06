import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { router, useForm } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { CheckCircle, Clock, Wrench, AlertTriangle, TrendingUp, FileText, Upload, MessageSquare } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dasbor Teknisi',
        href: '/dashboard',
    },
];

interface Stats {
    total_assigned: number;
    pending: number;
    in_progress: number;
    completed_today: number;
    completed_this_week: number;
    overdue: number;
}

interface Ticket {
    id: number;
    ticket_number: string;
    title: string;
    description: string;
    status: string;
    priority: string;
    category: {
        name: string;
    };
    user: {
        name: string;
    };
    sla?: {
        resolution_time_minutes: number;
    };
    progress?: Array<{
        status: string;
        note?: string;
        created_at: string;
    }>;
    created_at: string;
    updated_at: string;
}

interface Props {
    stats: Stats;
    recentTickets: Ticket[];
}

export default function Dashboard({ stats, recentTickets }: Props) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'submitted': return 'bg-gray-100 text-gray-800';
            case 'processed': return 'bg-blue-100 text-blue-800';
            case 'repairing': return 'bg-yellow-100 text-yellow-800';
            case 'done': return 'bg-green-100 text-green-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'low': return 'bg-green-100 text-green-800';
            case 'medium': return 'bg-yellow-100 text-yellow-800';
            case 'high': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const handleQuickAction = (ticketId: number, action: string, data?: any) => {
        switch (action) {
            case 'start_repair':
                router.post(`/technician/tickets/${ticketId}/status`, { status: 'repairing' });
                break;
            case 'complete':
                router.post(`/technician/tickets/${ticketId}/status`, { status: 'done' });
                break;
            case 'add_note':
                if (data?.note) {
                    router.post(`/technician/tickets/${ticketId}/progress`, { note: data.note });
                }
                break;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dasbor Teknisi" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl px-6 pt-6 pb-20 md:p-6 bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">Dasbor Teknisi</h1>
                    <Button onClick={() => router.visit('/admin/tickets?assigned_to=me')} variant="outline" className="border-blue-200 hover:bg-blue-50">
                        Lihat Semua Tiket Saya
                    </Button>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                    <Card
                        className="cursor-pointer hover:shadow-lg hover:border-blue-500 transition-all border-0 bg-gradient-to-br from-blue-50 to-blue-100"
                        onClick={() => router.visit('/admin/tickets?assigned_to=me')}
                    >
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-blue-900">Total Ditugaskan</CardTitle>
                            <FileText className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-700">{stats.total_assigned}</div>
                            <p className="text-xs text-blue-600">Tiket yang ditugaskan kepada Anda</p>
                        </CardContent>
                    </Card>

                    <Card
                        className="cursor-pointer hover:shadow-lg hover:border-cyan-500 transition-all border-0 bg-gradient-to-br from-cyan-50 to-cyan-100"
                        onClick={() => router.visit('/admin/tickets?assigned_to=me&status=processed')}
                    >
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-cyan-900">Menunggu</CardTitle>
                            <Clock className="h-4 w-4 text-cyan-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-cyan-700">{stats.pending}</div>
                            <p className="text-xs text-cyan-600">Menunggu untuk memulai</p>
                        </CardContent>
                    </Card>

                    <Card
                        className="cursor-pointer hover:shadow-lg hover:border-amber-500 transition-all border-0 bg-gradient-to-br from-amber-50 to-amber-100"
                        onClick={() => router.visit('/admin/tickets?assigned_to=me&status=repairing')}
                    >
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-amber-900">Sedang Dikerjakan</CardTitle>
                            <Wrench className="h-4 w-4 text-amber-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-amber-700">{stats.in_progress}</div>
                            <p className="text-xs text-amber-600">Sedang diperbaiki</p>
                        </CardContent>
                    </Card>

                    <Card
                        className="cursor-pointer hover:shadow-lg hover:border-emerald-500 transition-all border-0 bg-gradient-to-br from-emerald-50 to-emerald-100"
                        onClick={() => router.visit('/admin/tickets?assigned_to=me&status=done&date=today')}
                    >
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-emerald-900">Selesai Hari Ini</CardTitle>
                            <CheckCircle className="h-4 w-4 text-emerald-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-emerald-700">{stats.completed_today}</div>
                            <p className="text-xs text-emerald-600">Selesai hari ini</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Additional Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                    <Card
                        className="cursor-pointer hover:shadow-lg hover:border-green-500 transition-all border-0 bg-gradient-to-br from-green-50 to-green-100"
                        onClick={() => router.visit('/admin/tickets?assigned_to=me&status=done&date=week')}
                    >
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-green-900">Minggu Ini</CardTitle>
                            <TrendingUp className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-700">{stats.completed_this_week}</div>
                            <p className="text-xs text-green-600">Selesai minggu ini</p>
                        </CardContent>
                    </Card>

                    <Card
                        className="cursor-pointer hover:shadow-lg hover:border-red-500 transition-all border-0 bg-gradient-to-br from-red-50 to-red-100"
                        onClick={() => router.visit('/admin/tickets?assigned_to=me&overdue=true')}
                    >
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-red-900">Terlambat</CardTitle>
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-700">{stats.overdue}</div>
                            <p className="text-xs text-red-600">Melewati batas waktu SLA</p>
                        </CardContent>
                    </Card>

                    <Card
                        className="cursor-pointer hover:shadow-lg hover:border-indigo-500 transition-all border-0 bg-gradient-to-br from-indigo-50 to-indigo-100"
                        onClick={() => router.visit('/admin/tickets?assigned_to=me&status=done')}
                    >
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-indigo-900">Tingkat Keberhasilan</CardTitle>
                            <CheckCircle className="h-4 w-4 text-indigo-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-indigo-700">
                                {stats.total_assigned > 0
                                    ? Math.round(((stats.completed_this_week + stats.completed_today) / stats.total_assigned) * 100)
                                    : 0}%
                            </div>
                            <Progress
                                value={stats.total_assigned > 0 ? ((stats.completed_this_week + stats.completed_today) / stats.total_assigned) * 100 : 0}
                                className="mt-2 bg-indigo-200 [&>*]:bg-indigo-600"
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Tickets */}
                <Card>
                    <CardHeader>
                        <CardTitle>Tiket Ditugaskan Terbaru</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentTickets.length === 0 ? (
                                <p className="text-center text-muted-foreground py-8">
                                    Belum ada tiket yang ditugaskan.
                                </p>
                            ) : (
                                recentTickets.map((ticket) => (
                                    <div key={ticket.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="font-semibold">{ticket.title}</h3>
                                                    <Badge className={getStatusColor(ticket.status)}>
                                                        {ticket.status}
                                                    </Badge>
                                                    <Badge variant="outline" className={getPriorityColor(ticket.priority)}>
                                                        {ticket.priority}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-muted-foreground mb-2">
                                                    #{ticket.ticket_number} • {ticket.category.name} • {ticket.user.name}
                                                </p>
                                                <p className="text-sm line-clamp-2">{ticket.description}</p>
                                            </div>
                                            <div className="flex gap-2 ml-4">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => router.visit(`/technician/tickets/${ticket.id}`)}
                                                >
                                                    Lihat Detail
                                                </Button>
                                                {ticket.status === 'processed' && (
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleQuickAction(ticket.id, 'start_repair')}
                                                    >
                                                        Mulai Perbaikan
                                                    </Button>
                                                )}
                                                {ticket.status === 'repairing' && (
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleQuickAction(ticket.id, 'complete')}
                                                    >
                                                        Tandai Selesai
                                                    </Button>
                                                )}
                                            </div>
                                        </div>

                                        {ticket.progress && ticket.progress.length > 0 && (
                                            <div className="mt-3 p-3 bg-gray-50 rounded-md">
                                                <p className="text-sm">
                                                    <strong>Pembaruan Terakhir:</strong> {ticket.progress[0].note || `Status diubah menjadi ${ticket.progress[0].status}`}
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {new Date(ticket.progress[0].created_at).toLocaleString()}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
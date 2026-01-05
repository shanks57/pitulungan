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
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Dasbor Teknisi</h1>
                    <Button onClick={() => router.visit('/admin/tickets?assigned_to=me')} variant="outline">
                        Lihat Semua Tiket Saya
                    </Button>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Ditugaskan</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_assigned}</div>
                            <p className="text-xs text-muted-foreground">Tiket yang ditugaskan kepada Anda</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Menunggu</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.pending}</div>
                            <p className="text-xs text-muted-foreground">Menunggu untuk memulai</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Sedang Dikerjakan</CardTitle>
                            <Wrench className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.in_progress}</div>
                            <p className="text-xs text-muted-foreground">Sedang diperbaiki</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Selesai Hari Ini</CardTitle>
                            <CheckCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.completed_today}</div>
                            <p className="text-xs text-muted-foreground">Selesai hari ini</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Additional Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Minggu Ini</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.completed_this_week}</div>
                            <p className="text-xs text-muted-foreground">Selesai minggu ini</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Terlambat</CardTitle>
                            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
                            <p className="text-xs text-muted-foreground">Melewati batas waktu SLA</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Tingkat Keberhasilan</CardTitle>
                            <CheckCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.total_assigned > 0
                                    ? Math.round(((stats.completed_this_week + stats.completed_today) / stats.total_assigned) * 100)
                                    : 0}%
                            </div>
                            <Progress
                                value={stats.total_assigned > 0 ? ((stats.completed_this_week + stats.completed_today) / stats.total_assigned) * 100 : 0}
                                className="mt-2"
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
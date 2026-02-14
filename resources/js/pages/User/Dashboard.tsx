import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import {
    FileText,
    Clock,
    Wrench,
    CheckCircle,
    XCircle,
    AlertTriangle,
    TrendingUp,
    Plus,
    Eye,
    BarChart3,
    Calendar,
    Target
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dasbor Pengguna',
        href: dashboard().url,
    },
];

interface Stats {
    total_tickets: number;
    submitted: number;
    processed: number;
    repairing: number;
    done: number;
    rejected: number;
    high_priority: number;
    medium_priority: number;
    low_priority: number;
    completed_this_week: number;
    pending_response: number;
    resolution_rate: number;
}

interface Ticket {
    id: number;
    ticket_number: string;
    title: string;
    status: string;
    priority: string;
    category: {
        name: string;
    };
    assignedUser?: {
        name: string;
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

    // Calculate percentages for status distribution
    const statusData = [
        { status: 'Dikirim', count: stats.submitted, color: 'bg-gray-500', icon: Clock },
        { status: 'Diproses', count: stats.processed, color: 'bg-blue-500', icon: Clock },
        { status: 'Diperbaiki', count: stats.repairing, color: 'bg-yellow-500', icon: Wrench },
        { status: 'Selesai', count: stats.done, color: 'bg-green-500', icon: CheckCircle },
        { status: 'Ditolak', count: stats.rejected, color: 'bg-red-500', icon: XCircle },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dasbor Pengguna" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl px-4 pt-4 pb-20 md:p-4 bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Dasbor Saya</h1>
                        <p className="text-muted-foreground text-sm md:text-base">Selamat datang kembali! Lacak tiket Anda dan ajukan permintaan baru.</p>
                    </div>
                    <Link href="/tickets/create">
                        <Button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg">
                            <Plus className="h-4 w-4" />
                            Buat Tiket
                        </Button>
                    </Link>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                    <Card
                        className="cursor-pointer hover:shadow-lg hover:border-blue-500 transition-all border-0 bg-gradient-to-br from-blue-50 to-blue-100"
                        onClick={() => router.visit('/user/tickets')}
                    >
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-blue-900">Total Tiket</CardTitle>
                            <FileText className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-700">{stats.total_tickets}</div>
                            <p className="text-xs text-blue-600">Tiket yang diajukan</p>
                        </CardContent>
                    </Card>

                    <Card
                        className="cursor-pointer hover:shadow-lg hover:border-emerald-500 transition-all border-0 bg-gradient-to-br from-emerald-50 to-emerald-100"
                        onClick={() => router.visit('/user/tickets?status=done')}
                    >
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-emerald-900">Tingkat Penyelesaian</CardTitle>
                            <Target className="h-4 w-4 text-emerald-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-emerald-700">{stats.resolution_rate}%</div>
                            <Progress value={stats.resolution_rate} className="mt-2 bg-emerald-200 [&>*]:bg-emerald-600" />
                        </CardContent>
                    </Card>

                    <Card
                        className="cursor-pointer hover:shadow-lg hover:border-amber-500 transition-all border-0 bg-gradient-to-br from-amber-50 to-amber-100"
                        onClick={() => router.visit('/user/tickets?status=processed,repairing')}
                    >
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-amber-900">Sedang Dikerjakan</CardTitle>
                            <Clock className="h-4 w-4 text-amber-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-amber-700">{stats.pending_response}</div>
                            <p className="text-xs text-amber-600">Sedang dikerjakan</p>
                        </CardContent>
                    </Card>

                    <Card
                        className="cursor-pointer hover:shadow-lg hover:border-green-500 transition-all border-0 bg-gradient-to-br from-green-50 to-green-100"
                        onClick={() => router.visit('/user/tickets?status=done')}
                    >
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-green-900">Selesai</CardTitle>
                            <CheckCircle className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-700">{stats.done}</div>
                            <p className="text-xs text-green-600">Berhasil diselesaikan</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Status Overview */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                    <Card className="border-0 bg-gradient-to-br from-indigo-50 to-indigo-100 shadow-md">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-indigo-900">
                                <BarChart3 className="h-5 w-5 text-indigo-600" />
                                Ringkasan Status Tiket
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {statusData.map((item) => (
                                    <div key={item.status} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <item.icon className="h-4 w-4 text-indigo-600" />
                                            <span className="text-sm font-medium text-indigo-900">{item.status}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-indigo-700 font-semibold">{item.count}</span>
                                            <div className="w-20 bg-indigo-200 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full ${item.color}`}
                                                    style={{
                                                        width: stats.total_tickets > 0 ? `${(item.count / stats.total_tickets) * 100}%` : '0%'
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 bg-gradient-to-br from-purple-50 to-purple-100 shadow-md">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-purple-900">
                                <TrendingUp className="h-5 w-5 text-purple-600" />
                                Aktivitas Terbaru
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                                        <span className="text-sm text-purple-900">Selesai minggu ini</span>
                                    </div>
                                    <span className="text-sm font-semibold text-purple-700">{stats.completed_this_week}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-blue-500" />
                                        <span className="text-sm text-purple-900">Menunggu respon</span>
                                    </div>
                                    <span className="text-sm font-semibold text-purple-700">{stats.pending_response}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                                        <span className="text-sm text-purple-900">Prioritas tinggi</span>
                                    </div>
                                    <span className="text-sm font-semibold text-purple-700">{stats.high_priority}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <XCircle className="h-4 w-4 text-red-500" />
                                        <span className="text-sm text-purple-900">Ditolak</span>
                                    </div>
                                    <span className="text-sm font-semibold text-purple-700">{stats.rejected}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Tickets */}
                <Card className="border-0 bg-gradient-to-br from-cyan-50 to-blue-100 shadow-md">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-blue-900">
                            <Calendar className="h-5 w-5 text-blue-600" />
                            Tiket Terbaru
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentTickets.map((ticket) => (
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
                                            {ticket.assignedUser && (
                                                <span className="truncate">Ditugaskan: {ticket.assignedUser.name}</span>
                                            )}
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
                            ))}
                        </div>
                        {recentTickets.length === 0 && (
                            <div className="text-center py-8">
                                <FileText className="h-12 w-12 text-blue-200 mx-auto mb-4" />
                                <p className="text-blue-800">Tidak ada tiket ditemukan.</p>
                                <Link href="/tickets/create">
                                    <Button className="mt-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Buat Tiket Pertama Anda
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
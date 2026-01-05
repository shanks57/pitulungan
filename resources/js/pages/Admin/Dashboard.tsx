import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    FileText,
    CheckCircle,
    AlertTriangle,
    TrendingUp,
    Users,
    BarChart3,
    Calendar,
    Target
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dasbor Admin',
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
    completed_today: number;
    completed_this_week: number;
    overdue: number;
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
    user: {
        name: string;
    };
    assignedUser?: {
        name: string;
    };
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

    // Calculate percentages for status distribution
    const statusData = [
        { status: 'Dikirim', count: stats.submitted, color: 'bg-gray-500' },
        { status: 'Diproses', count: stats.processed, color: 'bg-blue-500' },
        { status: 'Diperbaiki', count: stats.repairing, color: 'bg-yellow-500' },
        { status: 'Selesai', count: stats.done, color: 'bg-green-500' },
        { status: 'Ditolak', count: stats.rejected, color: 'bg-red-500' },
    ];

    const priorityData = [
        { priority: 'Tinggi', count: stats.high_priority, color: 'bg-red-500' },
        { priority: 'Sedang', count: stats.medium_priority, color: 'bg-yellow-500' },
        { priority: 'Rendah', count: stats.low_priority, color: 'bg-green-500' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dasbor Admin" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Dasbor Admin</h1>
                        <p className="text-muted-foreground">Selamat datang kembali! Berikut ringkasan sistem helpdesk Anda.</p>
                    </div>
                    <div className="flex gap-2">
                        <Link href="/admin/tickets">
                            <Button variant="outline">
                                <FileText className="mr-2 h-4 w-4" />
                                Lihat Semua Tiket
                            </Button>
                        </Link>
                        <Link href="/admin/users">
                            <Button variant="outline">
                                <Users className="mr-2 h-4 w-4" />
                                Kelola Pengguna
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Tiket</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_tickets}</div>
                            <p className="text-xs text-muted-foreground">Total tiket sepanjang waktu</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Tingkat Penyelesaian</CardTitle>
                            <Target className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.resolution_rate}%</div>
                            <Progress value={stats.resolution_rate} className="mt-2" />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Selesai Hari Ini</CardTitle>
                            <CheckCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.completed_today}</div>
                            <p className="text-xs text-muted-foreground">Tiket diselesaikan hari ini</p>
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
                </div>

                {/* Status Distribution */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart3 className="h-5 w-5" />
                                Distribusi Status Tiket
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {statusData.map((item) => (
                                    <div key={item.status} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                                            <span className="text-sm font-medium">{item.status}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-muted-foreground">{item.count}</span>
                                            <div className="w-20 bg-gray-200 rounded-full h-2">
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

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5" />
                                Distribusi Prioritas
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {priorityData.map((item) => (
                                    <div key={item.priority} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                                            <span className="text-sm font-medium">{item.priority} Priority</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-muted-foreground">{item.count}</span>
                                            <div className="w-20 bg-gray-200 rounded-full h-2">
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
                </div>

                {/* Weekly Performance & Achievements */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5" />
                                Minggu Ini
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-green-600">{stats.completed_this_week}</div>
                            <p className="text-sm text-muted-foreground">Tiket diselesaikan minggu ini</p>
                            <div className="mt-4">
                                <Progress
                                    value={stats.total_tickets > 0 ? (stats.completed_this_week / Math.max(stats.total_tickets * 0.1, 1)) * 100 : 0}
                                    className="h-2"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CheckCircle className="h-5 w-5" />
                                Kesehatan Sistem
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Tiket Aktif</span>
                                    <span>{stats.submitted + stats.processed + stats.repairing}</span>
                                </div>
                                <Progress
                                    value={stats.total_tickets > 0 ? ((stats.submitted + stats.processed + stats.repairing) / stats.total_tickets) * 100 : 0}
                                    className="h-2"
                                />
                                <div className="flex justify-between text-sm">
                                    <span>Tingkat Penyelesaian</span>
                                    <span>{stats.resolution_rate}%</span>
                                </div>
                                <Progress value={stats.resolution_rate} className="h-2" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Target className="h-5 w-5" />
                                Pencapaian
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                    <span className="text-sm">
                                        {stats.completed_today >= 5 ? 'Performa Tinggi' : 'Dalam Jalur'} Hari Ini
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                    <span className="text-sm">
                                        Tingkat Penyelesaian {stats.resolution_rate >= 80 ? 'Sangat Baik' : 'Baik'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle className={`h-4 w-4 ${stats.overdue === 0 ? 'text-green-500' : 'text-yellow-500'}`} />
                                    <span className="text-sm">
                                        {stats.overdue === 0 ? 'Tidak Ada Terlambat' : `${stats.overdue} Tiket Terlambat`}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Tickets */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            Tiket Terbaru
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentTickets.map((ticket) => (
                                <div key={ticket.id} className="flex items-center justify-between p-4 border rounded-lg">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-medium">{ticket.ticket_number}</span>
                                            <Badge className={getStatusColor(ticket.status)}>
                                                {ticket.status}
                                            </Badge>
                                            <Badge className={getPriorityColor(ticket.priority)}>
                                                {ticket.priority}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-1">{ticket.title}</p>
                                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                            <span>Oleh {ticket.user.name}</span>
                                            <span>Kategori: {ticket.category.name}</span>
                                            {ticket.assignedUser && (
                                                <span>Ditugaskan: {ticket.assignedUser.name}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(ticket.created_at).toLocaleDateString()}
                                        </p>
                                        <Link href={`/admin/tickets/${ticket.id}`}>
                                            <Button variant="outline" size="sm" className="mt-2">
                                                Lihat
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {recentTickets.length === 0 && (
                            <p className="text-center text-muted-foreground py-8">Tidak ada tiket ditemukan.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
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
        title: 'User Dashboard',
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
        { status: 'Submitted', count: stats.submitted, color: 'bg-gray-500', icon: Clock },
        { status: 'Processed', count: stats.processed, color: 'bg-blue-500', icon: Clock },
        { status: 'Repairing', count: stats.repairing, color: 'bg-yellow-500', icon: Wrench },
        { status: 'Done', count: stats.done, color: 'bg-green-500', icon: CheckCircle },
        { status: 'Rejected', count: stats.rejected, color: 'bg-red-500', icon: XCircle },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="User Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">My Dashboard</h1>
                        <p className="text-muted-foreground">Welcome back! Track your tickets and submit new requests.</p>
                    </div>
                    <Link href="/tickets/create">
                        <Button className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            Create Ticket
                        </Button>
                    </Link>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_tickets}</div>
                            <p className="text-xs text-muted-foreground">Tickets submitted</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
                            <Target className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.resolution_rate}%</div>
                            <Progress value={stats.resolution_rate} className="mt-2" />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.pending_response}</div>
                            <p className="text-xs text-muted-foreground">Being worked on</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Completed</CardTitle>
                            <CheckCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{stats.done}</div>
                            <p className="text-xs text-muted-foreground">Successfully resolved</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Status Overview */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart3 className="h-5 w-5" />
                                Ticket Status Overview
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {statusData.map((item) => (
                                    <div key={item.status} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <item.icon className="h-4 w-4 text-muted-foreground" />
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
                                <TrendingUp className="h-5 w-5" />
                                Recent Activity
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                        <span className="text-sm">Completed this week</span>
                                    </div>
                                    <span className="text-sm font-medium">{stats.completed_this_week}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-blue-500" />
                                        <span className="text-sm">Pending response</span>
                                    </div>
                                    <span className="text-sm font-medium">{stats.pending_response}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                                        <span className="text-sm">High priority</span>
                                    </div>
                                    <span className="text-sm font-medium">{stats.high_priority}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <XCircle className="h-4 w-4 text-red-500" />
                                        <span className="text-sm">Rejected</span>
                                    </div>
                                    <span className="text-sm font-medium">{stats.rejected}</span>
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
                            Recent Tickets
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentTickets.map((ticket) => (
                                <div key={ticket.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-medium">{ticket.ticket_number}</span>
                                            <Badge className={getStatusColor(ticket.status)}>
                                                {getStatusIcon(ticket.status)}
                                                <span className="ml-1">{ticket.status}</span>
                                            </Badge>
                                            <Badge className={getPriorityColor(ticket.priority)}>
                                                {ticket.priority}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-1">{ticket.title}</p>
                                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                            <span>Category: {ticket.category.name}</span>
                                            {ticket.assignedUser && (
                                                <span>Assigned: {ticket.assignedUser.name}</span>
                                            )}
                                            {ticket.progress && ticket.progress.length > 0 && (
                                                <span>Last update: {new Date(ticket.progress[0].created_at).toLocaleDateString()}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Link href={`/user/tickets/${ticket.id}`}>
                                            <Button variant="outline" size="sm">
                                                <Eye className="h-4 w-4 mr-1" />
                                                View
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {recentTickets.length === 0 && (
                            <div className="text-center py-8">
                                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <p className="text-muted-foreground">No tickets found.</p>
                                <Link href="/tickets/create">
                                    <Button className="mt-4">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Create Your First Ticket
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
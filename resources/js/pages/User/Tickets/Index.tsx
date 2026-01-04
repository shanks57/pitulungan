import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { router, Link } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { CheckCircle, Clock, Wrench, AlertTriangle, Plus, Eye } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'My Tickets', href: '/user/tickets' },
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Tickets" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">My Tickets</h1>
                    <Link href="/tickets/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Create New Ticket
                        </Button>
                    </Link>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total}</div>
                            <p className="text-xs text-muted-foreground">All my tickets</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Open</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.open}</div>
                            <p className="text-xs text-muted-foreground">Awaiting response</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.in_progress}</div>
                            <p className="text-xs text-muted-foreground">Being worked on</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.resolved}</div>
                            <p className="text-xs text-muted-foreground">Completed tickets</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <div className="flex gap-4">
                    <Input
                        placeholder="Search tickets..."
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
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="submitted">Submitted</SelectItem>
                            <SelectItem value="processed">Processed</SelectItem>
                            <SelectItem value="repairing">Repairing</SelectItem>
                            <SelectItem value="done">Done</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
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
                            <SelectValue placeholder="Priority" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Priority</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Tickets List */}
                <div className="space-y-4">
                    {tickets.data.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
                                <h3 className="text-lg font-semibold mb-2">No tickets found</h3>
                                <p className="text-muted-foreground text-center mb-4">
                                    You haven't created any tickets yet, or no tickets match your filters.
                                </p>
                                <Link href="/tickets/create">
                                    <Button>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Create Your First Ticket
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ) : (
                        tickets.data.map((ticket) => (
                            <Card key={ticket.id} className="hover:shadow-md transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <h3 className="text-lg font-semibold">{ticket.title}</h3>
                                                <Badge className={getStatusColor(ticket.status)}>
                                                    {ticket.status}
                                                </Badge>
                                                <Badge variant="outline" className={getPriorityColor(ticket.priority)}>
                                                    {ticket.priority}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground mb-2">
                                                #{ticket.ticket_number} • {ticket.category.name} • {ticket.location}
                                            </p>
                                            <p className="text-sm line-clamp-2">{ticket.description}</p>
                                        </div>
                                        <Link href={`/user/tickets/${ticket.id}`}>
                                            <Button variant="outline" size="sm">
                                                <Eye className="mr-2 h-4 w-4" />
                                                View Details
                                            </Button>
                                        </Link>
                                    </div>

                                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                                        <div className="flex items-center gap-4">
                                            <span>Created: {new Date(ticket.created_at).toLocaleDateString()}</span>
                                            {ticket.assigned_user && (
                                                <span>Assigned to: {ticket.assigned_user.name}</span>
                                            )}
                                        </div>
                                        {ticket.progress && ticket.progress.length > 0 && (
                                            <div className="text-right">
                                                <p className="text-xs">
                                                    Last update: {new Date(ticket.progress[0].created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {ticket.progress && ticket.progress.length > 0 && (
                                        <div className="mt-4 p-3 bg-gray-50 rounded-md">
                                            <p className="text-sm">
                                                <strong>Last Update:</strong> {ticket.progress[0].note || `Status changed to ${ticket.progress[0].status}`}
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
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
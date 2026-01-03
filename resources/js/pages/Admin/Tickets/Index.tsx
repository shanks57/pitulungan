import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { router, useForm } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Tickets', href: '/admin/tickets' },
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
    counts: {
        open: number;
        in_progress: number;
        resolved_today: number;
        total: number;
    };
}

export default function Index({ tickets, filters, counts }: Props) {
    const { data, setData, get, processing } = useForm({
        search: filters.search || '',
        status: filters.status || '',
        priority: filters.priority || '',
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
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1 className="text-2xl font-bold">Maintenance Tasks</h1>

                {/* Counts */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{counts.open}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{counts.in_progress}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Resolved Today</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{counts.resolved_today}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{counts.total}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <div className="flex gap-4">
                    <Input
                        placeholder="Search tickets..."
                        value={data.search}
                        onChange={(e) => setData('search', e.target.value)}
                    />
                    <Select value={data.status} onValueChange={(value) => setData('status', value)}>
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        {/* <SelectContent>
                            <SelectItem value="">All Status</SelectItem>
                            <SelectItem value="submitted">Submitted</SelectItem>
                            <SelectItem value="processed">Processed</SelectItem>
                            <SelectItem value="repairing">Repairing</SelectItem>
                            <SelectItem value="done">Done</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent> */}
                    </Select>
                    <Select value={data.priority} onValueChange={(value) => setData('priority', value)}>
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Priority" />
                        </SelectTrigger>
                        {/* <SelectContent>
                            <SelectItem value="">All Priority</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                        </SelectContent> */}
                    </Select>
                    <Button onClick={handleFilter} disabled={processing}>
                        Filter
                    </Button>
                </div>

                {/* Tickets */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {tickets.data.map((ticket) => (
                        <Card key={ticket.id}>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <CardTitle className="text-lg">{ticket.title}</CardTitle>
                                    <Badge className={getStatusColor(ticket.status)}>
                                        {ticket.status}
                                    </Badge>
                                </div>
                                <div className="text-sm text-gray-600">
                                    #{ticket.ticket_number} • {ticket.category.name}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm mb-2">
                                    {ticket.description.length > 100
                                        ? ticket.description.substring(0, 100) + '...'
                                        : ticket.description}
                                </p>
                                <div className="flex justify-between items-center">
                                    <div className="text-sm">
                                        <Badge variant="outline" className={getPriorityColor(ticket.priority)}>
                                            {ticket.priority}
                                        </Badge>
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {ticket.user.name}
                                    </div>
                                </div>
                                {ticket.assigned_user && (
                                    <div className="text-xs text-gray-500 mt-1">
                                        Assigned to: {ticket.assigned_user.name}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Pagination can be added here */}
            </div>
        </AppLayout>
    );
}
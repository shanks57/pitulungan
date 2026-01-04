import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { router } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { ArrowLeft, Clock, User, MapPin, FileText, MessageSquare } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'My Tickets', href: '/user/tickets' },
    { title: 'Ticket Details', href: '#' },
];

interface Ticket {
    id: number;
    ticket_number: string;
    title: string;
    description: string;
    status: string;
    priority: string;
    location: string;
    user: { name: string; email: string };
    category: { name: string };
    assigned_user: { name: string } | null;
    sla: { response_time_minutes: number; resolution_time_minutes: number } | null;
    created_at: string;
    updated_at: string;
    responded_at: string | null;
    resolved_at: string | null;
}

interface Progress {
    id: number;
    status: string;
    note: string | null;
    updated_by: { name: string };
    created_at: string;
}

interface Attachment {
    id: number;
    file_path: string;
    file_type: string;
    uploaded_by: { name: string };
    created_at: string;
}

interface Props {
    ticket: Ticket;
    progress: Progress[];
    attachments: Attachment[];
}

export default function Show({ ticket, progress, attachments }: Props) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'submitted': return 'bg-yellow-100 text-yellow-800';
            case 'processed': return 'bg-blue-100 text-blue-800';
            case 'repairing': return 'bg-orange-100 text-orange-800';
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
            case 'submitted': return '📝';
            case 'processed': return '⏳';
            case 'repairing': return '🔧';
            case 'done': return '✅';
            case 'rejected': return '❌';
            default: return '❓';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Ticket ${ticket.ticket_number}`} />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button variant="outline" onClick={() => router.visit('/user/tickets')}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to My Tickets
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold">Ticket #{ticket.ticket_number}</h1>
                        <p className="text-muted-foreground">{ticket.title}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Ticket Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5" />
                                    Ticket Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Badge className={getStatusColor(ticket.status)}>
                                        {getStatusIcon(ticket.status)} {ticket.status}
                                    </Badge>
                                    <Badge variant="outline" className={getPriorityColor(ticket.priority)}>
                                        {ticket.priority} priority
                                    </Badge>
                                </div>

                                <div>
                                    <h3 className="font-semibold mb-2">Description</h3>
                                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                        {ticket.description}
                                    </p>
                                </div>

                                <Separator />

                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-muted-foreground">Location:</span>
                                        <span>{ticket.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-muted-foreground">Category:</span>
                                        <span>{ticket.category.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-muted-foreground">Created:</span>
                                        <span>{new Date(ticket.created_at).toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-muted-foreground">Assigned to:</span>
                                        <span>{ticket.assigned_user?.name || 'Not assigned'}</span>
                                    </div>
                                </div>

                                {ticket.sla && (
                                    <>
                                        <Separator />
                                        <div>
                                            <h4 className="font-semibold mb-2">SLA Information</h4>
                                            <div className="text-sm space-y-1">
                                                <p>Response Time: {Math.floor(ticket.sla.response_time_minutes / 60)}h {ticket.sla.response_time_minutes % 60}m</p>
                                                <p>Resolution Time: {Math.floor(ticket.sla.resolution_time_minutes / 60)}h {ticket.sla.resolution_time_minutes % 60}m</p>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>

                        {/* Progress Timeline */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MessageSquare className="h-5 w-5" />
                                    Progress Timeline
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {progress.length === 0 ? (
                                    <p className="text-muted-foreground text-center py-4">
                                        No progress updates yet.
                                    </p>
                                ) : (
                                    <div className="space-y-4">
                                        {progress.map((item, index) => (
                                            <div key={item.id} className="flex gap-4">
                                                <div className="flex flex-col items-center">
                                                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                                                        {getStatusIcon(item.status)}
                                                    </div>
                                                    {index < progress.length - 1 && (
                                                        <div className="w-0.5 h-8 bg-border mt-2"></div>
                                                    )}
                                                </div>
                                                <div className="flex-1 pb-4">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <h4 className="font-semibold">
                                                            Status changed to {item.status}
                                                        </h4>
                                                        <span className="text-sm text-muted-foreground">
                                                            {new Date(item.created_at).toLocaleString()}
                                                        </span>
                                                    </div>
                                                    {item.note && (
                                                        <p className="text-sm text-muted-foreground mt-1">
                                                            {item.note}
                                                        </p>
                                                    )}
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        Updated by {item.updated_by.name}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Attachments */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Attachments</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {attachments.length === 0 ? (
                                    <p className="text-muted-foreground text-center py-4">
                                        No attachments uploaded.
                                    </p>
                                ) : (
                                    <div className="space-y-2">
                                        {attachments.map((attachment) => (
                                            <div key={attachment.id} className="flex items-center justify-between p-2 border rounded">
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium truncate">
                                                        {attachment.file_path.split('/').pop()}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {attachment.uploaded_by.name} • {new Date(attachment.created_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <Button variant="outline" size="sm" asChild>
                                                    <a href={`/storage/${attachment.file_path}`} target="_blank" rel="noopener noreferrer">
                                                        View
                                                    </a>
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Quick Stats */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Ticket Status</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span>Status:</span>
                                    <Badge className={getStatusColor(ticket.status)}>
                                        {ticket.status}
                                    </Badge>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Priority:</span>
                                    <Badge variant="outline" className={getPriorityColor(ticket.priority)}>
                                        {ticket.priority}
                                    </Badge>
                                </div>
                                {ticket.responded_at && (
                                    <div className="flex justify-between text-sm">
                                        <span>Responded:</span>
                                        <span>{new Date(ticket.responded_at).toLocaleString()}</span>
                                    </div>
                                )}
                                {ticket.resolved_at && (
                                    <div className="flex justify-between text-sm">
                                        <span>Resolved:</span>
                                        <span>{new Date(ticket.resolved_at).toLocaleString()}</span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
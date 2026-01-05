import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { router, useForm } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Tickets', href: '/admin/tickets' },
    { title: 'Detail', href: '/admin/tickets/detail' },
];

interface Ticket {
    id: number;
    ticket_number: string;
    title: string;
    description: string;
    status: string;
    priority: string;
    location: string;
    user: { name: string; username: string };
    category: { id: number; name: string };
    assigned_user: { id: number; name: string } | null;
    sla: { priority: string; response_time_minutes: number; resolution_time_minutes: number } | null;
    created_at: string;
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

interface Comment {
    id: number;
    comment: string;
    user: { name: string; role: string };
    attachments: Attachment[];
    created_at: string;
}

interface Props {
    ticket: Ticket;
    progress: Progress[];
    attachments: Attachment[];
    comments: Comment[];
    categories: { id: number; name: string }[];
    users: { id: number; name: string }[];
}

export default function Show({ ticket, progress, attachments, comments, categories, users }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        title: ticket.title,
        description: ticket.description,
        category_id: ticket.category.id.toString(),
        priority: ticket.priority,
        location: ticket.location,
        assigned_to: ticket.assigned_user?.id?.toString() || '',
        status: ticket.status,
    });

    const { data: commentData, setData: setCommentData, post: postComment, processing: commentProcessing, reset: resetComment } = useForm({
        comment: '',
        attachments: null as FileList | null,
    });

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/tickets/${ticket.id}`);
    };

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('comment', commentData.comment);

        if (commentData.attachments) {
            Array.from(commentData.attachments).forEach((file, index) => {
                formData.append(`attachments[${index}]`, file);
            });
        }

        postComment(`/tickets/${ticket.id}/comments`, {
            data: formData,
            onSuccess: () => {
                resetComment();
            },
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
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Ticket #{ticket.ticket_number}</h1>
                    <Badge className={getStatusColor(ticket.status)}>
                        {ticket.status}
                    </Badge>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Ticket Details Form */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Ticket Details</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleUpdate} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="title">Title</Label>
                                            <Input
                                                id="title"
                                                value={data.title}
                                                onChange={(e) => setData('title', e.target.value)}
                                                required
                                            />
                                            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                                        </div>

                                        <div>
                                            <Label htmlFor="category_id">Category</Label>
                                            <Select value={data.category_id} onValueChange={(value) => setData('category_id', value)}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {categories.map((category) => (
                                                        <SelectItem key={category.id} value={category.id.toString()}>
                                                            {category.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.category_id && <p className="text-red-500 text-sm mt-1">{errors.category_id}</p>}
                                        </div>

                                        <div>
                                            <Label htmlFor="priority">Priority</Label>
                                            <Select value={data.priority} onValueChange={(value) => setData('priority', value)}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="low">Low</SelectItem>
                                                    <SelectItem value="medium">Medium</SelectItem>
                                                    <SelectItem value="high">High</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {errors.priority && <p className="text-red-500 text-sm mt-1">{errors.priority}</p>}
                                        </div>

                                        <div>
                                            <Label htmlFor="status">Status</Label>
                                            <Select value={data.status} onValueChange={(value) => setData('status', value)}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="submitted">Submitted</SelectItem>
                                                    <SelectItem value="processed">Processed</SelectItem>
                                                    <SelectItem value="repairing">Repairing</SelectItem>
                                                    <SelectItem value="done">Done</SelectItem>
                                                    <SelectItem value="rejected">Rejected</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status}</p>}
                                        </div>

                                        <div>
                                            <Label htmlFor="location">Location</Label>
                                            <Input
                                                id="location"
                                                value={data.location}
                                                onChange={(e) => setData('location', e.target.value)}
                                                required
                                            />
                                            {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                                        </div>

                                        <div>
                                            <Label htmlFor="assigned_to">Assigned To</Label>
                                            <Select value={data.assigned_to} onValueChange={(value) => setData('assigned_to', value)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select user" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="unassigned">Unassigned</SelectItem>
                                                    {users.map((user) => (
                                                        <SelectItem key={user.id} value={user.id.toString()}>
                                                            {user.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.assigned_to && <p className="text-red-500 text-sm mt-1">{errors.assigned_to}</p>}
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="description">Description</Label>
                                        <textarea
                                            id="description"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            required
                                            rows={4}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                                    </div>

                                    <Button type="submit" disabled={processing}>
                                        Update Ticket
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Progress Timeline & Activity */}
                    <div className="space-y-6">
                        {/* Progress Timeline */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Progress Timeline</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {progress.map((item, index) => (
                                        <div key={item.id} className="flex gap-3">
                                            <div className="flex flex-col items-center">
                                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                                {index < progress.length - 1 && <div className="w-0.5 h-8 bg-gray-300"></div>}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <Badge className={getStatusColor(item.status)}>
                                                        {item.status}
                                                    </Badge>
                                                    <span className="text-sm text-gray-500">
                                                        by {item.updated_by.name}
                                                    </span>
                                                </div>
                                                {item.note && (
                                                    <p className="text-sm text-gray-600 mt-1">{item.note}</p>
                                                )}
                                                <p className="text-xs text-gray-400 mt-1">
                                                    {new Date(item.created_at).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Comments Section */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Comments</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {/* Add Comment Form */}
                                <form onSubmit={handleCommentSubmit} className="mb-6">
                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor="comment">Add Comment</Label>
                                            <Textarea
                                                id="comment"
                                                value={commentData.comment}
                                                onChange={(e) => setCommentData('comment', e.target.value)}
                                                placeholder="Add a comment..."
                                                rows={3}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="comment-attachments">Attachments (optional)</Label>
                                            <Input
                                                id="comment-attachments"
                                                type="file"
                                                multiple
                                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.mp4,.avi,.mov"
                                                onChange={(e) => setCommentData('attachments', e.target.files)}
                                            />
                                            <p className="text-xs text-gray-500 mt-1">
                                                Max 10MB per file. Supported: PDF, DOC, DOCX, JPG, PNG, GIF, MP4, AVI, MOV
                                            </p>
                                        </div>
                                        <Button type="submit" disabled={commentProcessing}>
                                            {commentProcessing ? 'Adding...' : 'Add Comment'}
                                        </Button>
                                    </div>
                                </form>

                                {/* Comments List */}
                                <div className="space-y-4">
                                    {comments.map((comment) => (
                                        <div key={comment.id} className="border rounded-lg p-4">
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                                        {comment.user.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">{comment.user.name}</p>
                                                        <p className="text-xs text-gray-500">
                                                            {comment.user.role} • {new Date(comment.created_at).toLocaleString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-700 mb-3 whitespace-pre-wrap">
                                                {comment.comment}
                                            </p>
                                            {comment.attachments && comment.attachments.length > 0 && (
                                                <div className="space-y-2">
                                                    <p className="text-sm font-medium">Attachments:</p>
                                                    {comment.attachments.map((attachment) => (
                                                        <div key={attachment.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-medium truncate">
                                                                    {attachment.file_path.split('/').pop()}
                                                                </p>
                                                                <p className="text-xs text-gray-500">
                                                                    Uploaded by {attachment.uploaded_by.name}
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
                                        </div>
                                    ))}
                                    {comments.length === 0 && (
                                        <p className="text-center text-gray-500 py-4">No comments yet.</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Activity Log */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Activity Log</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="text-sm">
                                        <span className="font-medium">Created:</span> {new Date(ticket.created_at).toLocaleString()}
                                        <br />
                                        <span className="text-gray-600">by {ticket.user.name}</span>
                                    </div>
                                    {ticket.responded_at && (
                                        <div className="text-sm">
                                            <span className="font-medium">Responded:</span> {new Date(ticket.responded_at).toLocaleString()}
                                        </div>
                                    )}
                                    {ticket.resolved_at && (
                                        <div className="text-sm">
                                            <span className="font-medium">Resolved:</span> {new Date(ticket.resolved_at).toLocaleString()}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Attachments */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Attachments</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {attachments.length > 0 ? (
                                    <div className="space-y-2">
                                        {attachments.map((attachment) => (
                                            <div key={attachment.id} className="flex items-center justify-between p-2 border rounded">
                                                <div>
                                                    <p className="text-sm font-medium">{attachment.file_path.split('/').pop()}</p>
                                                    <p className="text-xs text-gray-500">
                                                        Uploaded by {attachment.uploaded_by.name} on {new Date(attachment.created_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <Button variant="outline" size="sm">
                                                    Download
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500">No attachments</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
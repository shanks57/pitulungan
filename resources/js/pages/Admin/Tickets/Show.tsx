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
import { FileText, X } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dasbor', href: '/dashboard' },
    { title: 'Tiket', href: '/admin/tickets' },
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
        attachments: [] as File[],
    });

    const [selectedAttachment, setSelectedAttachment] = useState<Attachment | null>(null);

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/tickets/${ticket.id}`);
    };

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('comment', commentData.comment);

        if (commentData.attachments && commentData.attachments.length > 0) {
            commentData.attachments.forEach((file, index) => {
                formData.append(`attachments[${index}]`, file);
            });
        }

        postComment(`/tickets/${ticket.id}/comments`, {
            forceFormData: true,
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

    const isImageFile = (filePath: string) => {
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];
        return imageExtensions.some(ext => filePath.toLowerCase().endsWith(ext));
    };

    const isVideoFile = (filePath: string) => {
        const videoExtensions = ['.mp4', '.avi', '.mov', '.mkv', '.webm', '.flv'];
        return videoExtensions.some(ext => filePath.toLowerCase().endsWith(ext));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pt-4 px-4 pb-20 md:p-4 rounded-xl">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Ticket #{ticket.ticket_number}</h1>
                    <Badge className={getStatusColor(ticket.status)}>
                        {ticket.status}
                    </Badge>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Ticket Details Form */}
                    <div className="lg:col-span-2">
                        <Card className="border-0 bg-gradient-to-br from-white to-blue-50 shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-blue-900">Detail Tiket</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleUpdate} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="title" className="text-blue-900 font-semibold">Judul</Label>
                                            <Input
                                                id="title"
                                                value={data.title}
                                                onChange={(e) => setData('title', e.target.value)}
                                                required
                                                className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                                            />
                                            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                                        </div>

                                        <div>
                                            <Label htmlFor="category_id" className="text-blue-900 font-semibold">Kategori</Label>
                                            <Select value={data.category_id} onValueChange={(value) => setData('category_id', value)}>
                                                <SelectTrigger className="border-blue-200 focus:border-blue-500 focus:ring-blue-500">
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
                                            <Label htmlFor="priority" className="text-blue-900 font-semibold">Prioritas</Label>
                                            <Select value={data.priority} onValueChange={(value) => setData('priority', value)}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="low">Rendah</SelectItem>
                                                    <SelectItem value="medium">Sedang</SelectItem>
                                                    <SelectItem value="high">Tinggi</SelectItem>
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
                                                    <SelectItem value="submitted">Diajukan</SelectItem>
                                                    <SelectItem value="processed">Diproses</SelectItem>
                                                    <SelectItem value="repairing">Diperbaiki</SelectItem>
                                                    <SelectItem value="done">Selesai</SelectItem>
                                                    <SelectItem value="rejected">Ditolak</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status}</p>}
                                        </div>

                                        <div>
                                            <Label htmlFor="location">Lokasi</Label>
                                            <Input
                                                id="location"
                                                value={data.location}
                                                onChange={(e) => setData('location', e.target.value)}
                                                required
                                            />
                                            {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                                        </div>

                                        <div>
                                            <Label htmlFor="assigned_to">Ditugaskan Ke</Label>
                                            <Select value={data.assigned_to} onValueChange={(value) => setData('assigned_to', value)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih pengguna" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="unassigned">Tidak ditugaskan</SelectItem>
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
                                        <Label htmlFor="description">Deskripsi</Label>
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
                                        Perbarui Tiket
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
                                <CardTitle>Timeline Progress</CardTitle>
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
                                                        oleh {item.updated_by.name}
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
                                <CardTitle>Komentar</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {/* Add Comment Form */}
                                <form onSubmit={handleCommentSubmit} className="mb-6">
                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor="comment">Tambah Komentar</Label>
                                            <Textarea
                                                id="comment"
                                                value={commentData.comment}
                                                onChange={(e) => setCommentData('comment', e.target.value)}
                                                placeholder="Tambah komentar..."
                                                rows={3}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="comment-attachments">Lampiran (opsional)</Label>
                                            <Input
                                                id="comment-attachments"
                                                type="file"
                                                multiple
                                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.mp4,.avi,.mov"
                                                onChange={(e) => setCommentData('attachments', e.target.files ? Array.from(e.target.files) : [])}
                                            />
                                            <p className="text-xs text-gray-500 mt-1">
                                                Maksimal 10MB per file. Didukung: PDF, DOC, DOCX, JPG, PNG, GIF, MP4, AVI, MOV
                                            </p>
                                        </div>
                                        <Button type="submit" disabled={commentProcessing}>
                                            {commentProcessing ? 'Menambah...' : 'Tambah Komentar'}
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
                                                    <p className="text-sm font-medium">Lampiran:</p>
                                                    {comment.attachments.map((attachment) => (
                                                        <div key={attachment.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-medium truncate">
                                                                    {attachment.file_path.split('/').pop()}
                                                                </p>
                                                                <p className="text-xs text-gray-500">
                                                                    Diupload oleh {attachment.uploaded_by.name}
                                                                </p>
                                                            </div>
                                                            <Button 
                                                                variant="outline" 
                                                                size="sm"
                                                                onClick={() => setSelectedAttachment(attachment)}
                                                            >
                                                                Lihat
                                                            </Button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    {comments.length === 0 && (
                                        <p className="text-center text-gray-500 py-4">Belum ada komentar.</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Activity Log */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Log Aktivitas</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="text-sm">
                                        <span className="font-medium">Dibuat:</span> {new Date(ticket.created_at).toLocaleString()}
                                        <br />
                                        <span className="text-gray-600">oleh {ticket.user.name}</span>
                                    </div>
                                    {ticket.responded_at && (
                                        <div className="text-sm">
                                            <span className="font-medium">Direspons:</span> {new Date(ticket.responded_at).toLocaleString()}
                                        </div>
                                    )}
                                    {ticket.resolved_at && (
                                        <div className="text-sm">
                                            <span className="font-medium">Diselesaikan:</span> {new Date(ticket.resolved_at).toLocaleString()}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Attachments */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Lampiran</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {attachments.length > 0 ? (
                                    <div className="space-y-2">
                                        {attachments.map((attachment) => (
                                            <div key={attachment.id} className="flex items-center justify-between p-2 border rounded">
                                                <div>
                                                    <p className="text-sm font-medium">{attachment.file_path.split('/').pop()}</p>
                                                    <p className="text-xs text-gray-500">
                                                        Diupload oleh {attachment.uploaded_by.name} pada {new Date(attachment.created_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <Button 
                                                    variant="outline" 
                                                    size="sm"
                                                    onClick={() => setSelectedAttachment(attachment)}
                                                >
                                                    Lihat
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500">Tidak ada lampiran</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Attachment Preview Modal */}
            {selectedAttachment && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto flex flex-col">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center p-6 border-b">
                            <h3 className="text-lg font-semibold text-gray-900">
                                {selectedAttachment.file_path.split('/').pop()}
                            </h3>
                            <button
                                onClick={() => setSelectedAttachment(null)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="flex-1 p-6 flex items-center justify-center">
                            {isImageFile(selectedAttachment.file_path) ? (
                                <img
                                    src={`/storage/${selectedAttachment.file_path}`}
                                    alt="preview"
                                    className="max-w-full max-h-96 object-contain"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                    }}
                                />
                            ) : isVideoFile(selectedAttachment.file_path) ? (
                                <video
                                    controls
                                    className="max-w-full max-h-96"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                    }}
                                >
                                    <source src={`/storage/${selectedAttachment.file_path}`} />
                                    Browser Anda tidak mendukung video preview.
                                </video>
                            ) : null}
                            <div className="hidden text-center">
                                <FileText className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                                <p className="text-gray-600">Preview tidak tersedia untuk file ini</p>
                                <p className="text-sm text-gray-500 mt-2">
                                    {selectedAttachment.file_path.split('/').pop()}
                                </p>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex justify-between items-center p-6 border-t bg-gray-50">
                            <p className="text-sm text-gray-600">
                                Diupload oleh {selectedAttachment.uploaded_by.name} pada{' '}
                                {new Date(selectedAttachment.created_at).toLocaleString()}
                            </p>
                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    onClick={() => setSelectedAttachment(null)}
                                >
                                    Tutup
                                </Button>
                                <Button asChild>
                                    <a
                                        href={`/storage/${selectedAttachment.file_path}`}
                                        download
                                        className="flex items-center gap-2"
                                    >
                                        Download
                                    </a>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
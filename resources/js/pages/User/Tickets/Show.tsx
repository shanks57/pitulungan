import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { router, useForm } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { ArrowLeft, Clock, User, MapPin, FileText, MessageSquare, Wrench, CheckCircle, XCircle, HelpCircle, X } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dasbor', href: '/dashboard' },
    { title: 'Tiket Saya', href: '/user/tickets' },
    { title: 'Detail Tiket', href: '#' },
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
}

export default function Show({ ticket, progress, attachments, comments }: Props) {
    const { data: commentData, setData: setCommentData, post: postComment, processing: commentProcessing, reset: resetComment } = useForm({
        comment: '',
        attachments: [] as File[],
    });

    const [selectedAttachment, setSelectedAttachment] = useState<Attachment | null>(null);

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
            onSuccess: () => {
                resetComment();
            },
            forceFormData: true,
        });
    };

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
            case 'submitted': return <FileText className="h-4 w-4" />;
            case 'processed': return <Clock className="h-4 w-4" />;
            case 'repairing': return <Wrench className="h-4 w-4" />;
            case 'done': return <CheckCircle className="h-4 w-4" />;
            case 'rejected': return <XCircle className="h-4 w-4" />;
            default: return <HelpCircle className="h-4 w-4" />;
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
            <Head title={`Ticket ${ticket.ticket_number}`} />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl px-4 pt-4 pb-20 md:p-4 bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <Button variant="outline" onClick={() => router.visit('/user/tickets')} className="border-blue-200 hover:bg-blue-50">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Kembali ke Tiket Saya
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Ticket #{ticket.ticket_number}</h1>
                        <p className="text-slate-600">{ticket.title}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Ticket Details */}
                        <Card className="border-0 bg-gradient-to-br from-blue-50 to-blue-100 shadow-md">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-blue-900">
                                    <FileText className="h-5 w-5 text-blue-600" />
                                    Detail Tiket
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Badge className={getStatusColor(ticket.status)}>
                                        {getStatusIcon(ticket.status)} {ticket.status}
                                    </Badge>
                                    <Badge variant="outline" className={getPriorityColor(ticket.priority)}>
                                        Prioritas {ticket.priority}
                                    </Badge>
                                </div>

                                <div>
                                    <h3 className="font-semibold mb-2">Deskripsi</h3>
                                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                        {ticket.description}
                                    </p>
                                </div>

                                <Separator />

                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-muted-foreground">Lokasi:</span>
                                        <span>{ticket.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-muted-foreground">Kategori:</span>
                                        <span>{ticket.category.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-muted-foreground">Dibuat:</span>
                                        <span>{new Date(ticket.created_at).toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-muted-foreground">Ditugaskan ke:</span>
                                        <span>{ticket.assigned_user?.name || 'Belum ditugaskan'}</span>
                                    </div>
                                </div>

                                {ticket.sla && (
                                    <>
                                        <Separator />
                                        <div>
                                            <h4 className="font-semibold mb-2">Informasi SLA</h4>
                                            <div className="text-sm space-y-1">
                                                <p>Waktu Respons: {Math.floor(ticket.sla.response_time_minutes / 60)}j {ticket.sla.response_time_minutes % 60}m</p>
                                                <p>Waktu Penyelesaian: {Math.floor(ticket.sla.resolution_time_minutes / 60)}j {ticket.sla.resolution_time_minutes % 60}m</p>
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
                                    Timeline Progress
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {progress.length === 0 ? (
                                    <p className="text-muted-foreground text-center py-4">
                                        Belum ada pembaruan progress.
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
                                                            Status diubah menjadi {item.status}
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
                                                        Diperbarui oleh {item.updated_by.name}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Comments Section */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MessageSquare className="h-5 w-5" />
                                    Komentar
                                </CardTitle>
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
                                            <p className="text-xs text-muted-foreground mt-1">
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
                                                        <p className="text-xs text-muted-foreground">
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
                                                                <p className="text-xs text-muted-foreground">
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
                                        <p className="text-center text-muted-foreground py-4">Belum ada komentar.</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Attachments */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Lampiran</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {attachments.length === 0 ? (
                                    <p className="text-muted-foreground text-center py-4">
                                        Tidak ada lampiran yang diupload.
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
                            </CardContent>
                        </Card>

                        {/* Quick Stats */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Status Tiket</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span>Status:</span>
                                    <Badge className={getStatusColor(ticket.status)}>
                                        {ticket.status}
                                    </Badge>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Prioritas:</span>
                                    <Badge variant="outline" className={getPriorityColor(ticket.priority)}>
                                        {ticket.priority}
                                    </Badge>
                                </div>
                                {ticket.responded_at && (
                                    <div className="flex justify-between text-sm">
                                        <span>Direspons:</span>
                                        <span>{new Date(ticket.responded_at).toLocaleString()}</span>
                                    </div>
                                )}
                                {ticket.resolved_at && (
                                    <div className="flex justify-between text-sm">
                                        <span>Diselesaikan:</span>
                                        <span>{new Date(ticket.resolved_at).toLocaleString()}</span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Modal Preview Lampiran */}
            {selectedAttachment && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
                        {/* Header */}
                        <div className="flex items-center justify-between border-b p-4">
                            <div>
                                <h2 className="text-lg font-semibold">
                                    {selectedAttachment.file_path.split('/').pop()}
                                </h2>
                                <p className="text-sm text-gray-500">
                                    Diupload oleh {selectedAttachment.uploaded_by.name}
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedAttachment(null)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-4 flex items-center justify-center min-h-96">
                            {isImageFile(selectedAttachment.file_path) ? (
                                <img
                                    src={`/storage/${selectedAttachment.file_path}`}
                                    alt={selectedAttachment.file_path.split('/').pop()}
                                    className="max-w-full max-h-96 object-contain"
                                />
                            ) : isVideoFile(selectedAttachment.file_path) ? (
                                <video
                                    controls
                                    className="max-w-full max-h-96"
                                >
                                    <source src={`/storage/${selectedAttachment.file_path}`} />
                                    Browser Anda tidak mendukung video player.
                                </video>
                            ) : (
                                <div className="text-center">
                                    <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-600 mb-4">File tidak bisa di-preview</p>
                                    <Button asChild>
                                        <a
                                            href={`/storage/${selectedAttachment.file_path}`}
                                            download
                                            className="bg-blue-600 hover:bg-blue-700 text-white"
                                        >
                                            Download File
                                        </a>
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="border-t p-4 flex gap-2 justify-end">
                            <Button
                                variant="outline"
                                onClick={() => setSelectedAttachment(null)}
                            >
                                Tutup
                            </Button>
                            <Button
                                asChild
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                <a
                                    href={`/storage/${selectedAttachment.file_path}`}
                                    download
                                >
                                    Download
                                </a>
                            </Button>
                        </div>
                    </div>
                </div>
            )}

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
<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use App\Models\TicketComment;
use App\Models\TicketAttachment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class TicketCommentController extends Controller
{
    public function store(Request $request, Ticket $ticket)
    {
        $request->validate([
            'comment' => 'required|string|max:1000',
            'attachments' => 'nullable|array',
            'attachments.*' => 'file|max:10240|mimes:pdf,doc,docx,jpg,jpeg,png,gif,mp4,avi,mov',
        ]);

        if ($ticket->status === 'done') {
            return back()->with('error', 'Tiket telah selesai. Komentar tidak diperbolehkan.');
        }

        // Create the comment
        $comment = TicketComment::create([
            'ticket_id' => $ticket->id,
            'user_id' => $request->user()->id,
            'comment' => $request->comment,
        ]);

        // Handle file attachments
        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $file) {
                $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
                $originalName = preg_replace('/[^A-Za-z0-9\-]/', '_', $originalName);
                $extension = $file->getClientOriginalExtension();
                $timestamp = now()->format('YmdHis');
                $newFileName = "{$originalName}_{$timestamp}.{$extension}";
                
                $path = $file->storeAs('ticket-attachments', $newFileName, 'public');

                TicketAttachment::create([
                    'ticket_id' => $ticket->id,
                    'comment_id' => $comment->id,
                    'file_path' => $path,
                    'file_type' => $file->getMimeType(),
                    'uploaded_by' => $request->user()->id,
                ]);
            }
        }

        // Notify ticket owner & assignee (except the comment author)
        $participants = collect([$ticket->user])->merge($ticket->assignees)->filter();
        $participants->unique('id')->each(function ($participant) use ($request, $ticket) {
            if ($participant->id === $request->user()->id) return;
            $participant->notify(new \App\Notifications\TicketUpdatedWebPush($ticket, 'Komentar baru: ' . \Illuminate\Support\Str::limit($request->comment, 120)));
        });

        return back()->with('success', 'Komentar berhasil ditambahkan.');
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class TicketController extends Controller
{
    public function index(Request $request)
    {
        $query = Ticket::with(['user', 'category', 'assignedUser']);

        // Search
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('ticket_number', 'like', "%{$search}%");
            });
        }

        // Filter by status
        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        // Filter by priority
        if ($request->has('priority') && $request->priority) {
            $query->where('priority', $request->priority);
        }

        $tickets = $query->paginate(10);

        // Counts
        $openCount = Ticket::where('status', 'submitted')->count();
        $inProgressCount = Ticket::whereIn('status', ['processed', 'repairing'])->count();
        $resolvedTodayCount = Ticket::where('status', 'done')
            ->whereDate('resolved_at', Carbon::today())
            ->count();
        $totalCount = Ticket::count();

        return Inertia::render('Admin/Tickets/Index', [
            'tickets' => $tickets,
            'filters' => $request->only(['search', 'status', 'priority']),
            'counts' => [
                'open' => $openCount,
                'in_progress' => $inProgressCount,
                'resolved_today' => $resolvedTodayCount,
                'total' => $totalCount,
            ],
        ]);
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use App\Models\TicketProgress;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->role === 'admin') {
            return Inertia::render('Admin/Dashboard');
        } elseif ($user->role === 'technician') {
            // Get technician's assigned tickets statistics
            $assignedTickets = Ticket::where('assigned_to', $user->id);

            $stats = [
                'total_assigned' => $assignedTickets->count(),
                'pending' => (clone $assignedTickets)->where('status', 'processed')->count(),
                'in_progress' => (clone $assignedTickets)->where('status', 'repairing')->count(),
                'completed_today' => (clone $assignedTickets)->where('status', 'done')
                    ->whereDate('updated_at', Carbon::today())->count(),
                'completed_this_week' => (clone $assignedTickets)->where('status', 'done')
                    ->whereBetween('updated_at', [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()])->count(),
                'overdue' => (clone $assignedTickets)->where('status', '!=', 'done')
                    ->whereHas('sla', function ($query) {
                        $query->whereRaw('TIMESTAMPDIFF(HOUR, tickets.created_at, NOW()) > sla.resolution_time_minutes / 60');
                    })->count(),
            ];

            // Get recent assigned tickets with relationships
            $recentTickets = Ticket::with(['user', 'category', 'sla', 'progress' => function ($query) {
                $query->latest()->limit(1);
            }])
                ->where('assigned_to', $user->id)
                ->orderBy('updated_at', 'desc')
                ->limit(10)
                ->get();

            return Inertia::render('Technician/Dashboard', [
                'stats' => $stats,
                'recentTickets' => $recentTickets,
            ]);
        } else {
            return Inertia::render('User/Dashboard');
        }
    }
}

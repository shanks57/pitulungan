<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use App\Models\TicketProgress;
use App\Models\Sla;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Container\Attributes\Auth;
use Illuminate\Support\Facades\Auth as FacadesAuth;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = FacadesAuth::user();

        if ($user->role === 'admin') {
            // Get overall system statistics
            $allTickets = Ticket::query();

            $stats = [
                'total_tickets' => $allTickets->count(),
                'submitted' => (clone $allTickets)->where('status', 'submitted')->count(),
                'processed' => (clone $allTickets)->where('status', 'processed')->count(),
                'repairing' => (clone $allTickets)->where('status', 'repairing')->count(),
                'done' => (clone $allTickets)->where('status', 'done')->count(),
                'rejected' => (clone $allTickets)->where('status', 'rejected')->count(),
                'high_priority' => (clone $allTickets)->where('priority', 'high')->count(),
                'medium_priority' => (clone $allTickets)->where('priority', 'medium')->count(),
                'low_priority' => (clone $allTickets)->where('priority', 'low')->count(),
                'completed_today' => (clone $allTickets)->where('status', 'done')
                    ->whereDate('updated_at', Carbon::today())->count(),
                'completed_this_week' => (clone $allTickets)->where('status', 'done')
                    ->whereBetween('updated_at', [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()])->count(),
                'overdue' => (clone $allTickets)->where('status', '!=', 'done')
                    ->whereHas('sla', function ($query) {
                        $query->whereRaw('TIMESTAMPDIFF(HOUR, tickets.created_at, NOW()) > sla.resolution_time_minutes / 60');
                    })->count(),
                'resolution_rate' => $allTickets->count() > 0
                    ? round(((clone $allTickets)->where('status', 'done')->count() / $allTickets->count()) * 100, 1)
                    : 0,
                // Time-based statistics
                'tickets_today' => (clone $allTickets)->whereDate('created_at', Carbon::today())->count(),
                'tickets_7days' => (clone $allTickets)->where('created_at', '>=', Carbon::now()->subDays(7))->count(),
                'tickets_14days' => (clone $allTickets)->where('created_at', '>=', Carbon::now()->subDays(14))->count(),
                'tickets_30days' => (clone $allTickets)->where('created_at', '>=', Carbon::now()->subDays(30))->count(),
            ];

            // Get recent tickets with relationships
            $recentTickets = Ticket::with(['user', 'category', 'assignees'])
                ->orderBy('created_at', 'desc')
                ->limit(10)
                ->get();
            // Get technicians for report filtering
            $technicians = \App\Models\User::where('role', 'technician')->get();

            return Inertia::render('Admin/Dashboard', [
                'stats' => $stats,
                'recentTickets' => $recentTickets,
                'technicians' => $technicians,
                'slas' => Sla::all(),
            ]);
        } elseif ($user->role === 'technician') {
            // Get technician's assigned tickets statistics
            $assignedTickets = clone Ticket::whereHas('assignees', function($q) use ($user) {
                $q->where('users.id', $user->id);
            });

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
                ->whereHas('assignees', function($q) use ($user) {
                    $q->where('users.id', $user->id);
                })
                ->orderBy('updated_at', 'desc')
                ->limit(10)
                ->get();

            return Inertia::render('Technician/Dashboard', [
                'stats' => $stats,
                'recentTickets' => $recentTickets,
                'slas' => Sla::all(),
            ]);
        } else {
            // Get user's own tickets statistics
            $userTicketsQuery = Ticket::where('user_id', $user->id);

            $stats = [
                'total_tickets' => (clone $userTicketsQuery)->count(),
                'submitted' => (clone $userTicketsQuery)->where('status', 'submitted')->count(),
                'processed' => (clone $userTicketsQuery)->where('status', 'processed')->count(),
                'repairing' => (clone $userTicketsQuery)->where('status', 'repairing')->count(),
                'done' => (clone $userTicketsQuery)->where('status', 'done')->count(),
                'rejected' => (clone $userTicketsQuery)->where('status', 'rejected')->count(),
                'high_priority' => (clone $userTicketsQuery)->where('priority', 'high')->count(),
                'medium_priority' => (clone $userTicketsQuery)->where('priority', 'medium')->count(),
                'low_priority' => (clone $userTicketsQuery)->where('priority', 'low')->count(),
                'completed_this_week' => (clone $userTicketsQuery)->where('status', 'done')
                    ->whereBetween('updated_at', [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()])->count(),
                'pending_response' => (clone $userTicketsQuery)->whereIn('status', ['processed', 'repairing'])->count(),
                'resolution_rate' => (clone $userTicketsQuery)->count() > 0
                    ? round(((clone $userTicketsQuery)->where('status', 'done')->count() / (clone $userTicketsQuery)->count()) * 100, 1)
                    : 0,
            ];

            // Get user's own recent tickets with relationships
            $recentTickets = Ticket::with(['category', 'assignees', 'progress' => function ($query) {
                $query->latest()->limit(1);
            }])
                ->where('user_id', $user->id)
                ->orderBy('updated_at', 'desc')
                ->limit(10)
                ->get();

            return Inertia::render('User/Dashboard', [
                'stats' => $stats,
                'recentTickets' => $recentTickets,
            ]);
        }
    }
}

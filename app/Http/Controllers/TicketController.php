<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use App\Models\TicketCategory;
use App\Models\Sla;
use App\Models\User;
use App\Models\TicketProgress;
use App\Models\TicketAttachment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Container\Attributes\Auth;
use Illuminate\Support\Facades\Auth as FacadesAuth;
use Illuminate\Support\Facades\Log;

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
        if ($request->has('status') && $request->status && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Filter by priority
        if ($request->has('priority') && $request->priority && $request->priority !== 'all') {
            $query->where('priority', $request->priority);
        }

        // Filter by assigned user
        if ($request->has('assigned_to') && $request->assigned_to) {
            if ($request->assigned_to === 'me') {
                $query->where('assigned_to', $request->user()->id);
            } elseif ($request->assigned_to === 'unassigned') {
                $query->whereNull('assigned_to');
            } else {
                $query->where('assigned_to', $request->assigned_to);
            }
        }

        // Filter by date range
        if ($request->has('date_from') && $request->date_from) {
            $dateFrom = $request->date_from;
            switch ($dateFrom) {
                case 'today':
                    $query->whereDate('created_at', Carbon::today());
                    break;
                case '7days':
                    $query->where('created_at', '>=', Carbon::now()->subDays(7));
                    break;
                case '14days':
                    $query->where('created_at', '>=', Carbon::now()->subDays(14));
                    break;
                case '30days':
                    $query->where('created_at', '>=', Carbon::now()->subDays(30));
                    break;
            }
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
            'filters' => $request->only(['search', 'status', 'priority', 'assigned_to', 'date_from']),
            'users' => User::whereIn('role', ['admin', 'technician'])->select('id', 'name')->get(),
            'counts' => [
                'open' => $openCount,
                'in_progress' => $inProgressCount,
                'resolved_today' => $resolvedTodayCount,
                'total' => $totalCount,
            ],
        ]);
    }

    public function create()
    {
        $categories = TicketCategory::with('subcategories')->get();
        $slas = Sla::all();

        return Inertia::render('Tickets/Create', [
            'categories' => $categories,
            'slas' => $slas,
        ]);
    }

    public function store(Request $request)
    {
        // Debug: Log the request data
        Log::info('Ticket store request data:', $request->all());

        try {
            $request->validate([
                'category_id' => 'required|exists:ticket_categories,id',
                'subcategory_id' => 'nullable|exists:ticket_subcategories,id',
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'location' => 'required|string|max:255',
                'priority' => 'required|in:low,medium,high',
                // 'attachments.*' => 'nullable|file|mimes:jpeg,png,jpg,gif,pdf,doc,docx,txt|max:10240', // 10MB max
            ]);

            Log::info('Validation passed');
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Validation failed:', $e->errors());
            throw $e;
        }

        $user = FacadesAuth::user();

        if (!$user) {
            Log::error('No authenticated user');
            return redirect()->route('login');
        }

        // Debug: Log the user
        Log::info('Authenticated user:', ['id' => $user->id, 'name' => $user->name]);

        // Get SLA based on priority
        $sla = Sla::where('priority', $request->priority)->first();

        // Find a technician assigned to this category
        $assignedTechnician = null;
        $categoryId = $request->category_id;

        // Get a technician who handles this category (round-robin or first available)
        $techniciansForCategory = User::whereHas('categories', function ($query) use ($categoryId) {
            $query->where('category_id', $categoryId);
        })->where('role', 'technician')->get();

        if ($techniciansForCategory->count() > 0) {
            // Get the first technician (can be improved with load balancing)
            $assignedTechnician = $techniciansForCategory->first();
        }

        try {
            $ticket = Ticket::create([
                'ticket_number' => 'TICK-' . strtoupper(uniqid()),
                'user_id' => $user->id,
                'category_id' => $request->category_id,
                'subcategory_id' => $request->subcategory_id ? (int)$request->subcategory_id : null,
                'sla_id' => $sla ? $sla->id : null,
                'title' => $request->title,
                'description' => $request->description,
                'location' => $request->location,
                'priority' => $request->priority,
                'status' => 'submitted',
                'assigned_to' => $assignedTechnician ? $assignedTechnician->id : null,
            ]);

            // Debug: Log ticket creation
            Log::info('Ticket created:', ['id' => $ticket->id, 'ticket_number' => $ticket->ticket_number, 'assigned_to' => $assignedTechnician ? $assignedTechnician->id : null]);
        } catch (\Exception $e) {
            Log::error('Ticket creation failed:', ['error' => $e->getMessage()]);
            return redirect()->back()->with('error', 'Failed to create ticket: ' . $e->getMessage());
        }

        // Handle file uploads
        // if ($request->hasFile('attachments')) {
        //     \Log::info('Processing attachments:', ['count' => count($request->file('attachments'))]);

        //     foreach ($request->file('attachments') as $file) {
        //         $originalName = $file->getClientOriginalName();
        //         $path = $file->store('ticket-attachments', 'public');

        //         TicketAttachment::create([
        //             'ticket_id' => $ticket->id,
        //             'file_path' => $path,
        //             'file_type' => $file->getMimeType(),
        //             'uploaded_by' => $user->id,
        //         ]);

        //         \Log::info('Attachment created:', ['path' => $path, 'type' => $file->getMimeType()]);
        //     }
        // }

        return redirect()->route('dashboard')->with('success', 'Ticket created successfully. Ticket number: ' . $ticket->ticket_number);
    }

    public function assign(Request $request, Ticket $ticket)
    {
        $request->validate([
            'assigned_to' => 'required|exists:users,id',
        ]);

        $ticket->update([
            'assigned_to' => $request->assigned_to,
            'status' => 'processed',
            'responded_at' => now(),
        ]);

        return redirect()->back()->with('success', 'Ticket assigned successfully.');
    }


    public function update(Request $request, Ticket $ticket)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'category_id' => 'required|exists:ticket_categories,id',
            'priority' => 'required|in:low,medium,high',
            'location' => 'required|string|max:255',
            'assigned_to' => 'nullable|exists:users,id',
            'status' => 'required|in:submitted,processed,repairing,done,rejected',
        ]);

        $user = FacadesAuth::user();

        $oldStatus = $ticket->status;
        $ticket->update($request->only([
            'title',
            'description',
            'category_id',
            'priority',
            'location',
            'assigned_to',
            'status'
        ]));

        // Create progress entry if status changed
        if ($oldStatus !== $request->status) {
            TicketProgress::create([
                'ticket_id' => $ticket->id,
                'status' => $request->status,
                'note' => 'Status updated from ' . $oldStatus,
                'updated_by' => $user->id,
            ]);
        }

        return redirect()->back()->with('success', 'Ticket updated successfully.');
    }

    public function updateStatus(Request $request, Ticket $ticket)
    {
        $request->validate([
            'status' => 'required|in:submitted,processed,repairing,done,rejected',
        ]);

        $user = FacadesAuth::user();

        // Check if technician is assigned to this ticket or is admin
        if ($user->role === 'technician' && $ticket->assigned_to !== $user->id) {
            abort(403, 'You can only update tickets assigned to you.');
        }

        $oldStatus = $ticket->status;
        $ticket->update(['status' => $request->status]);

        // Set resolved_at if status is done
        if ($request->status === 'done') {
            $ticket->update(['resolved_at' => now()]);
        }

        // Create progress entry
        TicketProgress::create([
            'ticket_id' => $ticket->id,
            'status' => $request->status,
            'note' => 'Status updated from ' . $oldStatus . ' to ' . $request->status,
            'updated_by' => $user->id,
        ]);

        return redirect()->back()->with('success', 'Ticket status updated successfully.');
    }

    public function addProgress(Request $request, Ticket $ticket)
    {
        $request->validate([
            'note' => 'required|string|max:1000',
        ]);

        $user = FacadesAuth::user();

        // Check if technician is assigned to this ticket or is admin
        if ($user->role === 'technician' && $ticket->assigned_to !== $user->id) {
            abort(403, 'You can only add progress to tickets assigned to you.');
        }

        TicketProgress::create([
            'ticket_id' => $ticket->id,
            'status' => $ticket->status,
            'note' => $request->note,
            'updated_by' => $user->id,
        ]);

        return redirect()->back()->with('success', 'Progress note added successfully.');
    }

    public function userTickets(Request $request)
    {
        $user = $request->user();

        $query = Ticket::with(['category', 'assignedUser', 'progress' => function ($query) {
            $query->latest()->limit(1);
        }])
            ->where('user_id', $user->id);

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
        if ($request->has('status') && $request->status && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Filter by priority
        if ($request->has('priority') && $request->priority && $request->priority !== 'all') {
            $query->where('priority', $request->priority);
        }


        $tickets = $query->orderBy('updated_at', 'desc')->paginate(10);

        // User-specific counts
        $totalTickets = Ticket::where('user_id', $user->id)->count();
        $openTickets = Ticket::where('user_id', $user->id)->whereIn('status', ['submitted', 'processed'])->count();
        $resolvedTickets = Ticket::where('user_id', $user->id)->where('status', 'done')->count();
        $inProgressTickets = Ticket::where('user_id', $user->id)->where('status', 'repairing')->count();

        return Inertia::render('User/Tickets/Index', [
            'tickets' => $tickets,
            'filters' => $request->only(['search', 'status', 'priority']),
            'stats' => [
                'total' => $totalTickets,
                'open' => $openTickets,
                'in_progress' => $inProgressTickets,
                'resolved' => $resolvedTickets,
            ],
        ]);
    }

    public function show(Request $request, Ticket $ticket)
    {
        $user = $request->user();

        // Check permissions based on role
        if ($user->role === 'user' && $ticket->user_id !== $user->id) {
            abort(403, 'You can only view your own tickets.');
        } elseif ($user->role === 'technician' && $ticket->assigned_to !== $user->id && $user->role !== 'admin') {
            abort(403, 'You can only view tickets assigned to you.');
        }

        $ticket->load([
            'user',
            'category',
            'assignedUser',
            'sla',
            'progress.updatedBy',
            'attachments.uploadedBy',
            'comments' => function ($query) {
                $query->with(['user', 'attachments.uploadedBy'])->orderBy('created_at', 'asc');
            }
        ]);

        // Return different views based on user role
        if ($user->role === 'user') {
            return Inertia::render('User/Tickets/Show', [
                'ticket' => $ticket,
                'progress' => $ticket->progress,
                'attachments' => $ticket->attachments,
                'comments' => $ticket->comments,
            ]);
        } elseif ($user->role === 'technician') {
            return Inertia::render('Admin/Tickets/Show', [
                'ticket' => $ticket,
                'progress' => $ticket->progress,
                'attachments' => $ticket->attachments,
                'comments' => $ticket->comments,
                'categories' => TicketCategory::all(),
                'users' => User::whereIn('role', ['admin', 'technician'])->get(),
            ]);
        } else {
            // Admin
            return Inertia::render('Admin/Tickets/Show', [
                'ticket' => $ticket,
                'progress' => $ticket->progress,
                'attachments' => $ticket->attachments,
                'comments' => $ticket->comments,
                'categories' => TicketCategory::all(),
                'users' => User::whereIn('role', ['admin', 'technician'])->get(),
            ]);
        }
    }
}

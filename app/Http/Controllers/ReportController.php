<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\View;

class ReportController extends Controller
{
    /**
     * Performance report: response time from created -> resolved.
     * Query params: date_from (Y-m-d), date_to (Y-m-d), format (html|pdf)
     */
    public function performanceReport(Request $request)
    {
        $validated = $request->validate([
            'date_from' => 'nullable|date',
            'date_to' => 'nullable|date',
            'format' => 'nullable|in:html,pdf',
        ]);

        $dateTo = isset($validated['date_to']) ? Carbon::parse($validated['date_to'])->endOfDay() : Carbon::now()->endOfDay();
        $dateFrom = isset($validated['date_from']) ? Carbon::parse($validated['date_from'])->startOfDay() : (clone $dateTo)->subDays(30)->startOfDay();

        $tickets = Ticket::with('assignedUser', 'user')
            ->whereNotNull('resolved_at')
            ->whereBetween('resolved_at', [$dateFrom, $dateTo])
            ->get()
            ->map(function ($t) {
                $duration = $t->resolved_at->floatDiffInSeconds($t->created_at);
                $t->response_seconds = $duration;
                $t->response_hours = $duration / 3600;
                return $t;
            });

        // Per-technician statistics (include unassigned as key 'unassigned')
        $perTech = [];
        $tickets->groupBy(function ($t) {
            return $t->assigned_to ?? 'unassigned';
        })->each(function ($group, $assignedTo) use (&$perTech) {
            $durations = $group->pluck('response_seconds')->filter()->values()->all();
            sort($durations);
            $count = count($durations);
            $avg = $count ? array_sum($durations) / $count : 0;
            $median = 0;
            if ($count) {
                $mid = (int) floor(($count - 1) / 2);
                $median = ($count % 2) ? $durations[$mid] : ($durations[$mid] + $durations[$mid + 1]) / 2;
            }

            $perTech[$assignedTo] = [
                'count' => $count,
                'avg_seconds' => $avg,
                'median_seconds' => $median,
                'avg_hours' => $avg / 3600,
                'median_hours' => $median / 3600,
                'slowest' => collect($group)->sortByDesc('response_seconds')->take(10)->values(),
            ];
        });

        // Resolve technician names
        $techIds = array_filter(array_keys($perTech), function ($k) {
            return $k !== 'unassigned';
        });
        $users = User::whereIn('id', $techIds)->get()->keyBy('id');
        $perTech = collect($perTech)->mapWithKeys(function ($v, $k) use ($users) {
            $label = $k === 'unassigned' ? 'Unassigned' : ($users[$k]->name ?? "#{$k}");
            return [$label => $v];
        })->toArray();

        // Overall metrics (admin-level)
        $allDurations = $tickets->pluck('response_seconds')->filter()->all();
        $overall = [
            'count' => count($allDurations),
            'avg_hours' => count($allDurations) ? (array_sum($allDurations) / count($allDurations)) / 3600 : 0,
            'max_hours' => count($allDurations) ? (max($allDurations) / 3600) : 0,
            'p95_hours' => $this->percentile($allDurations, 0.95) / 3600,
        ];

        $viewData = [
            'date_from' => $dateFrom,
            'date_to' => $dateTo,
            'perTech' => $perTech,
            'overall' => $overall,
            'tickets' => $tickets->sortByDesc('response_seconds')->values(),
        ];

        $format = $validated['format'] ?? 'html';

        if ($format === 'pdf') {
            // Robust check for DOMPDF availability (support facade or bound wrapper)
            $hasPdf = class_exists(\Barryvdh\DomPDF\Facade\Pdf::class) || app()->bound('dompdf.wrapper');
            if (! $hasPdf) {
                return response()->json([
                    'error' => 'PDF generator not installed. Run `composer require barryvdh/laravel-dompdf` to enable PDF export.'
                ], 501);
            }

            try {
                // Prefer facade when available, otherwise resolve wrapper
                if (class_exists(\Barryvdh\DomPDF\Facade\Pdf::class)) {
                    $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('reports.performance', $viewData)->setPaper('a4', 'landscape');
                } else {
                    $pdf = app('dompdf.wrapper')->loadView('reports.performance', $viewData)->setPaper('a4', 'landscape');
                }

                $filename = 'performance-report-' . $dateFrom->format('Ymd') . '-' . $dateTo->format('Ymd') . '.pdf';

                // Stream as download so headers are explicit
                return response()->streamDownload(function () use ($pdf) {
                    echo $pdf->output();
                }, $filename, [
                    'Content-Type' => 'application/pdf',
                    'Content-Disposition' => 'attachment; filename="' . $filename . '"',
                ]);
            } catch (\Exception $e) {
                logger()->error('Performance PDF generation failed: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);

                // Fallback: return HTML preview when PDF fails (useful for debugging in-browser)
                if ($request->wantsJson() || $request->query('debug') === '1') {
                    return response()->json(['error' => 'PDF generation failed', 'details' => $e->getMessage()], 500);
                }

                return view('reports.performance', array_merge($viewData, ['pdf_error' => $e->getMessage()]));
            }
        }

        return view('reports.performance', $viewData);
    }

    protected function percentile(array $items, float $p)
    {
        if (empty($items)) return 0;
        sort($items);
        $idx = ($p * (count($items) - 1));
        $lower = floor($idx);
        $upper = ceil($idx);
        if ($lower == $upper) return $items[$idx];
        $weight = $idx - $lower;
        return $items[$lower] * (1 - $weight) + $items[$upper] * $weight;
    }
}

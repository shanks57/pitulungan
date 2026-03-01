<!doctype html>
<html lang="en">

<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Performance report</title>
    <style>
        body {
            font-family: DejaVu Sans, Arial, Helvetica, sans-serif;
            color: #222;
            background: #fff;
            transition: background 0.3s, color 0.3s;
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 24px;
            border-bottom: 2px solid #eee;
            padding-bottom: 12px;
        }

        h1 {
            font-size: 20px;
            margin: 0;
            color: #1e40af;
        }

        h2 {
            font-size: 16px;
            color: #1e3a8a;
            margin-top: 24px;
            border-left: 4px solid #3b82f6;
            padding-left: 10px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 12px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        th,
        td {
            border: 1px solid #ddd;
            padding: 10px;
            font-size: 12px;
        }

        th {
            background: #f8fafc;
            text-align: left;
            color: #475569;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        .muted {
            color: #64748b;
            font-size: 11px;
        }

        .small {
            font-size: 11px;
        }

        .right {
            text-align: right;
        }

        @media (prefers-color-scheme: dark) {
            body {
                background: #0f172a;
                color: #f1f5f9;
            }
            .header {
                border-bottom-color: #1e293b;
            }
            h1 {
                color: #60a5fa;
            }
            h2 {
                color: #93c5fd;
                border-left-color: #3b82f6;
            }
            th {
                background: #1e293b;
                color: #94a3b8;
                border-color: #334155;
            }
            td {
                border-color: #334155;
            }
            .muted {
                color: #94a3b8;
            }
            table {
                background: #0f172a;
            }
            tr:nth-child(even) {
                background: #1e293b20;
            }
        }
    </style>
</head>

<body>
    <div class="header">
        <div>
            <h1>Performance report — Response time (created → resolved)</h1>
            <div class="muted">Periode: {{ $date_from->toDateString() }} — {{ $date_to->toDateString() }}</div>
        </div>
        <div class="small muted">Generated: {{ now()->toDateTimeString() }}</div>
    </div>

    <h2 style="margin-top:8px;">Overall (admin)</h2>
    <table>
        <tr>
            <th>Total resolved</th>
            <th>Average (hours)</th>
            <th>Max (hours)</th>
            <th>95th percentile (hours)</th>
        </tr>
        <tr>
            <td>{{ $overall['count'] }}</td>
            <td class="right">{{ number_format($overall['avg_hours'], 2) }}</td>
            <td class="right">{{ number_format($overall['max_hours'], 2) }}</td>
            <td class="right">{{ number_format($overall['p95_hours'], 2) }}</td>
        </tr>
    </table>

    <h2 style="margin-top:18px;">Per technician</h2>
    <table>
        <tr>
            <th>Technician</th>
            <th>Resolved</th>
            <th>Average (hours)</th>
            <th>Median (hours)</th>
            <th>Slowest (top 3 hours)</th>
        </tr>
        @foreach($perTech as $tech => $stats)
        <tr>
            <td>{{ $tech }}</td>
            <td>{{ $stats['count'] }}</td>
            <td class="right">{{ number_format($stats['avg_hours'], 2) }}</td>
            <td class="right">{{ number_format($stats['median_hours'], 2) }}</td>
            <td class="small">
                @foreach($stats['slowest']->take(3) as $t)
                #{{ $t->ticket_number }} ({{ number_format($t->response_hours, 2) }}h) — {{ $t->title }}<br />
                @endforeach
            </td>
        </tr>
        @endforeach
    </table>

    <h2 style="margin-top:18px;">Slowest resolved tickets (top 20)</h2>
    <table>
        <tr>
            <th>#</th>
            <th>Ticket</th>
            <th>Owner</th>
            <th>Assigned</th>
            <th>Resolved at</th>
            <th>Response (hours)</th>
        </tr>
        @foreach($tickets->take(20) as $i => $t)
        <tr>
            <td>{{ $i + 1 }}</td>
            <td>#{{ $t->ticket_number }} — {{ $t->title }}</td>
            <td class="small">{{ $t->user->name ?? '—' }}</td>
            <td class="small">{{ optional($t->assignedUser)->name ?? 'Unassigned' }}</td>
            <td class="small">{{ optional($t->resolved_at)->toDateTimeString() }}</td>
            <td class="right">{{ number_format($t->response_hours, 2) }}</td>
        </tr>
        @endforeach
    </table>

</body>

</html>
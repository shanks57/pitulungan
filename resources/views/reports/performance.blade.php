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
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 18px
        }

        h1 {
            font-size: 18px;
            margin: 0
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 12px
        }

        th,
        td {
            border: 1px solid #ddd;
            padding: 8px;
            font-size: 12px
        }

        th {
            background: #f6f6f6;
            text-align: left
        }

        .muted {
            color: #666;
            font-size: 11px
        }

        .small {
            font-size: 11px
        }

        .right {
            text-align: right
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
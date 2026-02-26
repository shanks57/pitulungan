<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        .title {
            font-size: 16pt;
            font-weight: bold;
            text-align: center;
        }
        .header-cell {
            background-color: #FFFF00;
            font-weight: bold;
            text-align: center;
            border: 1px solid #000000;
        }
        .data-cell {
            border: 1px solid #000000;
            vertical-align: top;
        }
        .metadata-label {
            font-weight: bold;
        }
    </style>
</head>
<body>
    <table>
        <tr>
            <td colspan="7" class="title">Laporan Kendala Terhadap Layanan Teknologi Informasi RSUD KEPOHBARU</td>
        </tr>
        <tr><td colspan="7"></td></tr>
        <tr>
            <td colspan="2"><span class="metadata-label">Nama</span></td>
            <td colspan="5">: {{ $technician ? $technician->name : 'Semua Teknisi' }}</td>
        </tr>
        <tr>
            <td colspan="2"><span class="metadata-label">NIP</span></td>
            <td colspan="5">: {{ $technician ? ($technician->nip ?: '-') : '-' }}</td>
        </tr>
        <tr>
            <td colspan="2"><span class="metadata-label">Bulan</span></td>
            <td colspan="5">: {{ $month_name }}</td>
        </tr>
        <tr><td colspan="7"></td></tr>
        <thead>
            <tr>
                <th class="header-cell" style="width: 50px;">No.</th>
                <th class="header-cell" style="width: 150px;">Hari/Tanggal</th>
                <th class="header-cell" style="width: 100px;">Unit</th>
                <th class="header-cell" style="width: 300px;">Kendala</th>
                <th class="header-cell" style="width: 150px;">Waktu Pelaporan</th>
                <th class="header-cell" style="width: 150px;">Waktu Selesai</th>
                <th class="header-cell" style="width: 250px;">Keterangan</th>
            </tr>
        </thead>
        <tbody>
            @foreach($tickets as $index => $ticket)
            <tr>
                <td class="data-cell" style="text-align: center;">{{ $index + 1 }}</td>
                <td class="data-cell">{{ $ticket->resolved_at->translatedFormat('l, d F Y') }}</td>
                <td class="data-cell" style="text-align: center;">{{ $ticket->category->name ?? '-' }}</td>
                <td class="data-cell">{{ $ticket->title }} - {{ $ticket->description }}</td>
                <td class="data-cell" style="text-align: center;">{{ $ticket->created_at->format('d/m/Y H:i') }}</td>
                <td class="data-cell" style="text-align: center;">{{ $ticket->resolved_at ? $ticket->resolved_at->format('d/m/Y H:i') : '-' }}</td>
                <td class="data-cell">
                    @php
                        $lastProgress = $ticket->progress->last();
                    @endphp
                    {{ $lastProgress ? $lastProgress->notes : '' }}
                </td>
            </tr>
            @endforeach
            @for($i = count($tickets) + 1; $i <= max(5, count($tickets)); $i++)
            <tr>
                <td class="data-cell" style="text-align: center;">{{ $i }}</td>
                <td class="data-cell"></td>
                <td class="data-cell"></td>
                <td class="data-cell"></td>
                <td class="data-cell"></td>
                <td class="data-cell"></td>
                <td class="data-cell"></td>
            </tr>
            @endfor
        </tbody>
    </table>
</body>
</html>

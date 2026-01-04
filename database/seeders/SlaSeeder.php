<?php

namespace Database\Seeders;

use App\Models\Sla;
use Illuminate\Database\Seeder;

class SlaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $slas = [
            [
                'priority' => 'low',
                'response_time_minutes' => 480, // 8 hours
                'resolution_time_minutes' => 2880, // 2 days
            ],
            [
                'priority' => 'medium',
                'response_time_minutes' => 240, // 4 hours
                'resolution_time_minutes' => 1440, // 1 day
            ],
            [
                'priority' => 'high',
                'response_time_minutes' => 60, // 1 hour
                'resolution_time_minutes' => 480, // 8 hours
            ],
        ];

        foreach ($slas as $sla) {
            Sla::firstOrCreate(
                ['priority' => $sla['priority']],
                $sla
            );
        }
    }
}

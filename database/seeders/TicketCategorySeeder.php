<?php

namespace Database\Seeders;

use App\Models\TicketCategory;
use Illuminate\Database\Seeder;

class TicketCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'IT Infrastructure',
                'description' => 'Issues related to IT infrastructure, servers, networks, and hardware',
            ],
            [
                'name' => 'Software',
                'description' => 'Software-related issues, applications, and system errors',
            ],
            [
                'name' => 'Facilities',
                'description' => 'Building maintenance, electrical, plumbing, and facility issues',
            ],
            [
                'name' => 'Medical Equipment',
                'description' => 'Medical devices, equipment maintenance, and calibration',
            ],
            [
                'name' => 'Security',
                'description' => 'Security systems, access control, and safety concerns',
            ],
            [
                'name' => 'Other',
                'description' => 'Other miscellaneous issues',
            ],
        ];

        foreach ($categories as $category) {
            TicketCategory::firstOrCreate(
                ['name' => $category['name']],
                $category
            );
        }
    }
}

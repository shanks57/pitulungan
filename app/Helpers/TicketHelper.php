<?php

namespace App\Helpers;

class TicketHelper
{
    /**
     * Translate ticket status from English to Indonesian.
     *
     * @param string $status
     * @return string
     */
    public static function translateStatus($status)
    {
        $translations = [
            'submitted' => 'Diajukan',
            'processed' => 'Diproses',
            'repairing' => 'Diperbaiki',
            'done'      => 'Selesai',
            'rejected'  => 'Ditolak',
        ];

        return $translations[$status] ?? $status;
    }

    /**
     * Translate ticket priority from English to Indonesian.
     *
     * @param string $priority
     * @return string
     */
    public static function translatePriority($priority)
    {
        $translations = [
            'low'    => 'Rendah',
            'medium' => 'Sedang',
            'high'   => 'Tinggi',
        ];

        return $translations[$priority] ?? $priority;
    }
}

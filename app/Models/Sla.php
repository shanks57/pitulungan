<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sla extends Model
{
    use HasFactory;

    protected $fillable = [
        'priority',
        'response_time_minutes',
        'resolution_time_minutes',
    ];

    // Relationships
    public function tickets()
    {
        return $this->hasMany(Ticket::class, 'sla_id');
    }
}

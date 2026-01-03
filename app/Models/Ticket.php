<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ticket extends Model
{
    use HasFactory;

    protected $fillable = [
        'ticket_number',
        'user_id',
        'category_id',
        'sla_id',
        'title',
        'description',
        'location',
        'priority',
        'status',
        'assigned_to',
        'responded_at',
        'resolved_at',
    ];

    protected function casts(): array
    {
        return [
            'responded_at' => 'datetime',
            'resolved_at' => 'datetime',
        ];
    }

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function category()
    {
        return $this->belongsTo(TicketCategory::class, 'category_id');
    }

    public function sla()
    {
        return $this->belongsTo(Sla::class, 'sla_id');
    }

    public function assignedUser()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function comments()
    {
        return $this->hasMany(TicketComment::class);
    }

    public function progress()
    {
        return $this->hasMany(TicketProgress::class);
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }

    public function attachments()
    {
        return $this->hasMany(TicketAttachment::class);
    }
}

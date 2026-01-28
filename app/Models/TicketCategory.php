<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TicketCategory extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
    ];

    // Relationships
    public function subcategories()
    {
        return $this->hasMany(TicketSubcategory::class, 'category_id');
    }

    public function tickets()
    {
        return $this->hasMany(Ticket::class, 'category_id');
    }

    public function technicians()
    {
        return $this->belongsToMany(User::class, 'technician_ticket_categories', 'category_id', 'user_id');
    }
}

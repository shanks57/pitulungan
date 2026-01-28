<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TicketSubcategory extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id',
        'name',
        'description',
    ];

    // Relationships
    public function category()
    {
        return $this->belongsTo(TicketCategory::class, 'category_id');
    }

    public function tickets()
    {
        return $this->hasMany(Ticket::class, 'subcategory_id');
    }
}

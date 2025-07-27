<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    // Allow mass‑assignment only on these columns
    protected $fillable = [
        'user_id',
        'marked_at',
    ];

    // Cast marked_at to a DateTime instance
    protected $casts = [
        'marked_at' => 'datetime',
    ];

    /**
     * Each attendance entry belongs to a single user.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Disable updated_at (we never update attendance records after creation).
     */
    public $timestamps = false;
}

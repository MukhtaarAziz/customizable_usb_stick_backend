<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AdminSetting extends Model
{
    protected $fillable = [
        'user_id',
        'language',
        'pagination_per_page',
        'darkmode',
    ];

    protected $casts = [
        'pagination_per_page' => 'integer',
        'darkmode' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
